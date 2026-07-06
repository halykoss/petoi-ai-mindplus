/**
 * Mind+ Python-mode user library: AI Vision (LLM).
 * I blocchi generano chiamate al singleton ai definito in libraries/petoi_ai.py.
 */

//% color="#4c97ff" iconWidth=50 iconHeight=40
namespace petoiAiVisionPy {

    //% block="imposta API key [KEY]" blockType="command"
    //% KEY.shadow="string" KEY.defl="sk-or-..."
    export function setApiKey(parameter: any, block: any) {
        Generator.addImport(`from petoi_ai import ai`);
        Generator.addCode(`ai.set_api_key(${parameter.KEY.code})`);
    }

    //% block="imposta modello [MODEL]" blockType="command"
    //% MODEL.shadow="string" MODEL.defl="google/gemini-2.5-flash"
    export function setModel(parameter: any, block: any) {
        Generator.addImport(`from petoi_ai import ai`);
        Generator.addCode(`ai.set_model(${parameter.MODEL.code})`);
    }

    //% block="imposta endpoint API [URL]" blockType="command"
    //% URL.shadow="string" URL.defl="https://openrouter.ai/api/v1/chat/completions"
    export function setEndpoint(parameter: any, block: any) {
        Generator.addImport(`from petoi_ai import ai`);
        Generator.addCode(`ai.set_endpoint(${parameter.URL.code})`);
    }

    //% block="imposta prompt di sistema [PROMPT]" blockType="command"
    //% PROMPT.shadow="string" PROMPT.defl="Osserva la scena e scegli un comando tra quelli disponibili"
    export function setSystemPrompt(parameter: any, block: any) {
        Generator.addImport(`from petoi_ai import ai`);
        Generator.addCode(`ai.set_system_prompt(${parameter.PROMPT.code})`);
    }

    //% block="reasoning [STATE]" blockType="command"
    //% STATE.shadow="dropdown" STATE.options="REASONING"
    export function setReasoning(parameter: any, block: any) {
        Generator.addImport(`from petoi_ai import ai`);
        Generator.addCode(`ai.set_reasoning(${parameter.STATE.code})`);
    }

    //% block="imposta dimensione max immagine [PX] px" blockType="command"
    //% PX.shadow="number" PX.defl=512
    export function setMaxSize(parameter: any, block: any) {
        Generator.addImport(`from petoi_ai import ai`);
        Generator.addCode(`ai.set_max_size(${parameter.PX.code})`);
    }

    //% block="usa camera numero [INDEX]" blockType="command"
    //% INDEX.shadow="number" INDEX.defl=0
    export function setCameraIndex(parameter: any, block: any) {
        Generator.addImport(`from petoi_ai import ai`);
        Generator.addCode(`ai.set_camera_index(${parameter.INDEX.code})`);
    }

    //% block="avvia camera" blockType="command"
    export function startCamera(parameter: any, block: any) {
        Generator.addImport(`from petoi_ai import ai`);
        Generator.addCode(`ai.start_camera()`);
    }

    //% block="ferma camera" blockType="command"
    export function stopCamera(parameter: any, block: any) {
        Generator.addImport(`from petoi_ai import ai`);
        Generator.addCode(`ai.stop_camera()`);
    }

    //% block="acquisisci immagine" blockType="command"
    export function captureImage(parameter: any, block: any) {
        Generator.addImport(`from petoi_ai import ai`);
        Generator.addCode(`ai.capture()`);
    }

    //% block="invia immagine al massimo ogni [SEC] secondi" blockType="command"
    //% SEC.shadow="number" SEC.defl=3
    export function setSendInterval(parameter: any, block: any) {
        Generator.addImport(`from petoi_ai import ai`);
        Generator.addCode(`ai.set_min_interval(${parameter.SEC.code})`);
    }

    //% block="immagine acquisita" blockType="boolean"
    export function hasImage(parameter: any, block: any) {
        Generator.addImport(`from petoi_ai import ai`);
        Generator.addCode(`ai.has_image()`);
    }

    //% block="interroga AI su immagine, richiesta [USERTEXT]" blockType="reporter"
    //% USERTEXT.shadow="string" USERTEXT.defl="Cosa vedi, scegli un comando"
    export function askAboutImage(parameter: any, block: any) {
        Generator.addImport(`from petoi_ai import ai`);
        Generator.addCode(`ai.ask_image(${parameter.USERTEXT.code})`);
    }

    //% block="interroga AI solo testo [PROMPT]" blockType="reporter"
    //% PROMPT.shadow="string" PROMPT.defl="Ciao chi sei"
    export function askText(parameter: any, block: any) {
        Generator.addImport(`from petoi_ai import ai`);
        Generator.addCode(`ai.ask_text(${parameter.PROMPT.code})`);
    }

    //% block="ultima risposta" blockType="reporter"
    export function getLastResponse(parameter: any, block: any) {
        Generator.addImport(`from petoi_ai import ai`);
        Generator.addCode(`ai.get_last_response()`);
    }

    //% block="storico output ultimi [N]" blockType="reporter"
    //% N.shadow="number" N.defl=6
    export function getOutputLog(parameter: any, block: any) {
        Generator.addImport(`from petoi_ai import ai`);
        Generator.addCode(`ai.get_output_log(${parameter.N.code})`);
    }

    //% block="ultimo reasoning" blockType="reporter"
    export function getLastReasoning(parameter: any, block: any) {
        Generator.addImport(`from petoi_ai import ai`);
        Generator.addCode(`ai.get_last_reasoning()`);
    }

    //% block="azione scelta dal JSON" blockType="reporter"
    export function getAction(parameter: any, block: any) {
        Generator.addImport(`from petoi_ai import ai`);
        Generator.addCode(`ai.get_action()`);
    }

    //% block="dalla risposta campo JSON [FIELD]" blockType="reporter"
    //% FIELD.shadow="string" FIELD.defl="reason"
    export function getJsonField(parameter: any, block: any) {
        Generator.addImport(`from petoi_ai import ai`);
        Generator.addCode(`ai.get_json_field(${parameter.FIELD.code})`);
    }

    //% block="collega Petoi alla porta [PORT]" blockType="command"
    //% PORT.shadow="string" PORT.defl="/dev/cu.wchusbserial51850050421"
    export function connectPetoi(parameter: any, block: any) {
        Generator.addImport(`from petoi_ai import ai`);
        Generator.addCode(`ai.connect(${parameter.PORT.code})`);
    }

    //% block="Petoi connesso" blockType="boolean"
    export function isConnected(parameter: any, block: any) {
        Generator.addImport(`from petoi_ai import ai`);
        Generator.addCode(`ai.is_connected()`);
    }

    //% block="esegui azione [ACTION]" blockType="command"
    //% ACTION.shadow="dropdown" ACTION.options="ACTION"
    export function doAction(parameter: any, block: any) {
        Generator.addImport(`from petoi_ai import ai`);
        Generator.addCode(`ai.do_action("${parameter.ACTION.code}")`);
    }

    //% block="invia comando OpenCat [TOKEN]" blockType="command"
    //% TOKEN.shadow="string" TOKEN.defl="kwkF"
    export function sendToken(parameter: any, block: any) {
        Generator.addImport(`from petoi_ai import ai`);
        Generator.addCode(`ai.send_token(${parameter.TOKEN.code})`);
    }

    //% block="metti Petoi a riposo" blockType="command"
    export function restPetoi(parameter: any, block: any) {
        Generator.addImport(`from petoi_ai import ai`);
        Generator.addCode(`ai.rest()`);
    }

    //% block="invia messaggio [TEXT] a URL [URL]" blockType="command"
    //% TEXT.shadow="string" TEXT.defl="Ciao Claudio!!!"
    //% URL.shadow="string" URL.defl="https://petoi.onrender.com/api/messages"
    export function sendMessage(parameter: any, block: any) {
        Generator.addImport(`from petoi_ai import ai`);
        Generator.addCode(`ai.send_message(${parameter.URL.code}, ${parameter.TEXT.code})`);
    }

    //% block="esito ultimo messaggio HTTP" blockType="reporter"
    export function getLastPost(parameter: any, block: any) {
        Generator.addImport(`from petoi_ai import ai`);
        Generator.addCode(`ai.get_last_post()`);
    }

    //% block="scollega Petoi" blockType="command"
    export function disconnectPetoi(parameter: any, block: any) {
        Generator.addImport(`from petoi_ai import ai`);
        Generator.addCode(`ai.disconnect()`);
    }

    //% block="costo ultima query USD" blockType="reporter"
    export function getLastCost(parameter: any, block: any) {
        Generator.addImport(`from petoi_ai import ai`);
        Generator.addCode(`ai.get_last_cost()`);
    }

    //% block="costo totale sessione USD" blockType="reporter"
    export function getTotalCost(parameter: any, block: any) {
        Generator.addImport(`from petoi_ai import ai`);
        Generator.addCode(`ai.get_total_cost()`);
    }

    //% block="token ultima query" blockType="reporter"
    export function getLastTokens(parameter: any, block: any) {
        Generator.addImport(`from petoi_ai import ai`);
        Generator.addCode(`ai.get_last_tokens()`);
    }

    //% block="token totali sessione" blockType="reporter"
    export function getTotalTokens(parameter: any, block: any) {
        Generator.addImport(`from petoi_ai import ai`);
        Generator.addCode(`ai.get_total_tokens()`);
    }

    //% block="numero query" blockType="reporter"
    export function getQueryCount(parameter: any, block: any) {
        Generator.addImport(`from petoi_ai import ai`);
        Generator.addCode(`ai.get_query_count()`);
    }

    //% block="energia stimata Wh" blockType="reporter"
    export function getEnergyWh(parameter: any, block: any) {
        Generator.addImport(`from petoi_ai import ai`);
        Generator.addCode(`ai.get_energy_wh()`);
    }

    //% block="CO2 stimata g" blockType="reporter"
    export function getCo2(parameter: any, block: any) {
        Generator.addImport(`from petoi_ai import ai`);
        Generator.addCode(`ai.get_co2_g()`);
    }

    //% block="riepilogo statistiche" blockType="reporter"
    export function getStatsSummary(parameter: any, block: any) {
        Generator.addImport(`from petoi_ai import ai`);
        Generator.addCode(`ai.get_stats_summary()`);
    }

    //% block="azzera statistiche" blockType="command"
    export function resetStats(parameter: any, block: any) {
        Generator.addImport(`from petoi_ai import ai`);
        Generator.addCode(`ai.reset_stats()`);
    }

    //% block="stima [WH] Wh ogni 1000 token" blockType="command"
    //% WH.shadow="number" WH.defl=0.5
    export function setEnergyFactor(parameter: any, block: any) {
        Generator.addImport(`from petoi_ai import ai`);
        Generator.addCode(`ai.set_energy_factor(${parameter.WH.code})`);
    }

    //% block="stima intensita rete [G] g CO2 per kWh" blockType="command"
    //% G.shadow="number" G.defl=400
    export function setGridIntensity(parameter: any, block: any) {
        Generator.addImport(`from petoi_ai import ai`);
        Generator.addCode(`ai.set_grid_intensity(${parameter.G.code})`);
    }
}
