"""Libreria di supporto per l'estensione Mind+ (Python mode) "AI Vision".

Fa tutto il lavoro pesante: cattura dalla webcam (OpenCV), chiamata all'LLM
(OpenRouter / OpenAI-compatibile via requests), controllo seriale del Petoi
(pyserial), statistiche costo/token e stima impatto ambientale.

I blocchi Mind+ generano semplici chiamate al singleton `ai` definito in fondo.
"""

import time
import json
import base64
import re

# Mappa azione -> token OpenCat (firmware Petoi NyBoard).
OPENCAT_TOKENS = {
    "rest": "krest",
    "sit": "ksit",
    "stand": "kbalance",
    "balance": "kbalance",
    "walk_forward": "kwkF",
    "walk_left": "kwkL",
    "walk_right": "kwkR",
    "turn_left": "kvtL",
    "turn_right": "kvtR",
    "backward": "kbk",
    "greet": "khi",
    "stretch": "kstr",
    "look_up": "kup",
    "check": "kck",
    "play_dead": "kpd",
    "backflip": "kbf",
    "pushup": "kpu",
    "beep": "b 31 16 36 16 31 16 36 16 40 24 36 16 31 24",
}

DEFAULT_MODEL = "google/gemini-2.5-flash"
DEFAULT_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions"
DEFAULT_SYSTEM_PROMPT = (
    "Sei il cervello di un piccolo robot. Guarda l'immagine e rispondi in modo "
    "utile e conciso."
)


class AIVision:
    def __init__(self):
        # configurazione
        self.api_key = ""
        self.model = DEFAULT_MODEL
        self.endpoint = DEFAULT_ENDPOINT
        self.system_prompt = DEFAULT_SYSTEM_PROMPT
        self.max_size = 512
        self.camera_index = 0
        self.reasoning = False
        self.min_interval = 0.0

        # stato runtime
        self.last_image = None      # data URL JPEG
        self.last_response = ""
        self.last_reasoning = ""
        self.output_log = []
        self.max_log = 12
        self._last_send = 0.0
        self._cap = None
        self._ser = None
        self.last_post = ""         # esito ultimo invio messaggio HTTP

        # statistiche
        self.last_cost = 0.0
        self.total_cost = 0.0
        self.last_tokens = 0
        self.total_tokens = 0
        self.query_count = 0
        self.energy_wh_per_1k = 0.5
        self.g_co2_per_kwh = 400.0

    # ---------- configurazione ----------
    def set_api_key(self, k):
        self.api_key = str(k).strip()

    def set_model(self, m):
        self.model = str(m).strip()

    def set_endpoint(self, u):
        self.endpoint = str(u).strip()

    def set_system_prompt(self, p):
        self.system_prompt = str(p)

    def set_max_size(self, px):
        try:
            n = int(px)
            if n > 0:
                self.max_size = n
        except Exception:
            pass

    def set_camera_index(self, i):
        try:
            self.camera_index = int(i)
        except Exception:
            pass

    def set_reasoning(self, on):
        self.reasoning = bool(on)

    def set_min_interval(self, sec):
        try:
            s = float(sec)
            self.min_interval = s if s > 0 else 0.0
        except Exception:
            self.min_interval = 0.0

    # ---------- camera ----------
    def start_camera(self):
        import cv2
        if self._cap is None:
            self._cap = cv2.VideoCapture(self.camera_index)
        return self._cap.isOpened()

    def stop_camera(self):
        if self._cap is not None:
            self._cap.release()
            self._cap = None

    def capture(self):
        import cv2
        if self._cap is None:
            self.start_camera()
        ok, frame = (False, None)
        if self._cap is not None:
            ok, frame = self._cap.read()
        if not ok or frame is None:
            self.last_image = None
            return False
        h, w = frame.shape[:2]
        longest = max(h, w)
        if longest > self.max_size:
            s = self.max_size / float(longest)
            frame = cv2.resize(frame, (int(w * s), int(h * s)))
        ok, buf = cv2.imencode(".jpg", frame, [cv2.IMWRITE_JPEG_QUALITY, 80])
        if not ok:
            self.last_image = None
            return False
        self.last_image = "data:image/jpeg;base64," + base64.b64encode(buf.tobytes()).decode("ascii")
        return True

    def has_image(self):
        return self.last_image is not None

    # ---------- LLM ----------
    def ask_image(self, user_text=""):
        now = time.time()
        # throttle: rispetta la frequenza di invio impostata
        if self.min_interval > 0 and self._last_send and (now - self._last_send) < self.min_interval:
            return self.last_response
        self._last_send = now
        self.capture()
        return self._chat(True, user_text)

    def ask_text(self, prompt):
        return self._chat(False, prompt)

    def _chat(self, with_image, user_text):
        import requests
        if not self.api_key:
            self.last_response = "ERRORE: API key mancante"
            return self.last_response
        if with_image:
            if not self.last_image:
                self.last_response = "ERRORE: nessuna immagine acquisita"
                return self.last_response
            content = [
                {"type": "text", "text": user_text or "Descrivi la scena."},
                {"type": "image_url", "image_url": {"url": self.last_image}},
            ]
        else:
            content = user_text
        body = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": self.system_prompt},
                {"role": "user", "content": content},
            ],
            "usage": {"include": True},
        }
        if "openrouter" in self.endpoint:
            body["reasoning"] = {"enabled": self.reasoning}
        try:
            r = requests.post(
                self.endpoint,
                headers={
                    "Authorization": "Bearer " + self.api_key,
                    "Content-Type": "application/json",
                    "X-Title": "Mind+ AI Vision",
                },
                json=body,
                timeout=30,
            )
            r.raise_for_status()
            data = r.json()
            msg = data["choices"][0]["message"]
            self.last_response = (msg.get("content") or "").strip()
            self.last_reasoning = (msg.get("reasoning") or "").strip()
            self._push_log(self.last_response)
            self._record_usage(data.get("usage"))
        except Exception as e:
            self.last_response = "ERRORE: " + str(e)
        return self.last_response

    # ---------- risposta / parsing ----------
    def get_last_response(self):
        return self.last_response

    def get_last_reasoning(self):
        return self.last_reasoning

    def _push_log(self, text):
        if not text:
            return
        self.output_log.append(text)
        if len(self.output_log) > self.max_log:
            self.output_log.pop(0)

    def get_output_log(self, n=6):
        try:
            n = int(n)
        except Exception:
            n = 6
        if n <= 0:
            n = len(self.output_log)
        return "\n".join(self.output_log[-n:])

    def _extract_json(self, text):
        if not text:
            return None
        try:
            return json.loads(text)
        except Exception:
            pass
        m = re.search(r"\{.*\}", text, re.DOTALL)
        if m:
            try:
                return json.loads(m.group(0))
            except Exception:
                return None
        return None

    def get_action(self):
        obj = self._extract_json(self.last_response)
        if obj and obj.get("action") is not None:
            return str(obj.get("action"))
        return ""

    def get_json_field(self, field):
        obj = self._extract_json(self.last_response)
        if obj and obj.get(field) is not None:
            return str(obj.get(field))
        return ""

    # ---------- invio messaggio HTTP (webhook) ----------
    def send_message(self, url, text, source="robot"):
        """POST JSON {"text":..., "source":...} a un URL. URL e testo liberi."""
        import requests
        headers = {"Content-Type": "application/json"}
        payload = {"text": str(text), "source": str(source)}
        try:
            r = requests.post(url, headers=headers, json=payload, timeout=15)
            self.last_post = str(r.status_code)
        except Exception as e:
            self.last_post = "ERRORE: " + str(e)
        return self.last_post

    def get_last_post(self):
        return self.last_post

    # ---------- Petoi (seriale) ----------
    def connect(self, port, baud=115200):
        import serial
        try:
            self._ser = serial.Serial(port, baud, timeout=1)
            time.sleep(2)  # attesa boot scheda
            self._ser.reset_input_buffer()
            return True
        except Exception as e:
            print("AI Vision connect:", e)
            self._ser = None
            return False

    def is_connected(self):
        return self._ser is not None

    def _write(self, token):
        if self._ser is None:
            return
        try:
            self._ser.write((token + "\n").encode("ascii"))
            self._ser.flush()
        except Exception as e:
            print("AI Vision write:", e)

    def do_action(self, action):
        tok = OPENCAT_TOKENS.get(str(action))
        if tok:
            self._write(tok)

    def send_token(self, token):
        self._write(str(token))

    def rest(self):
        self._write("krest")

    def disconnect(self):
        if self._ser is not None:
            try:
                self._write("krest")
                self._ser.close()
            except Exception:
                pass
            self._ser = None

    # ---------- statistiche ----------
    def _record_usage(self, usage):
        usage = usage or {}
        tokens = usage.get("total_tokens")
        if tokens is None:
            tokens = (usage.get("prompt_tokens") or 0) + (usage.get("completion_tokens") or 0)
        cost = usage.get("cost")
        cost = float(cost) if isinstance(cost, (int, float)) else 0.0
        self.last_tokens = tokens
        self.total_tokens += tokens
        self.last_cost = cost
        self.total_cost += cost
        self.query_count += 1

    def get_last_cost(self):
        return round(self.last_cost, 6)

    def get_total_cost(self):
        return round(self.total_cost, 6)

    def get_last_tokens(self):
        return self.last_tokens

    def get_total_tokens(self):
        return self.total_tokens

    def get_query_count(self):
        return self.query_count

    def _energy_wh(self):
        return (self.total_tokens / 1000.0) * self.energy_wh_per_1k

    def _co2_g(self):
        return (self._energy_wh() / 1000.0) * self.g_co2_per_kwh

    def get_energy_wh(self):
        return round(self._energy_wh(), 3)

    def get_co2_g(self):
        return round(self._co2_g(), 3)

    def get_stats_summary(self):
        return ("query: %d | token: %d | costo: $%.5f | energia: %.2f Wh | CO2: %.2f g (stima)"
                % (self.query_count, self.total_tokens, self.total_cost,
                   self._energy_wh(), self._co2_g()))

    def reset_stats(self):
        self.last_cost = 0.0
        self.total_cost = 0.0
        self.last_tokens = 0
        self.total_tokens = 0
        self.query_count = 0

    def set_energy_factor(self, wh):
        try:
            n = float(wh)
            if n >= 0:
                self.energy_wh_per_1k = n
        except Exception:
            pass

    def set_grid_intensity(self, g):
        try:
            n = float(g)
            if n >= 0:
                self.g_co2_per_kwh = n
        except Exception:
            pass


# Singleton usato dai blocchi generati.
ai = AIVision()
