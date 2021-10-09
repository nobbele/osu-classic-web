use wasm_bindgen::prelude::*;

#[wasm_bindgen(js_name = "loadContent")]
pub fn load_content(content: &str) -> Result<JsValue, JsValue> {
    let beatmap =
        osu_parser::load_content(content).map_err(|e| JsValue::from_str(&e.to_string()))?;
    JsValue::from_serde(&beatmap).map_err(|e| JsValue::from_str(&e.to_string()))
}
