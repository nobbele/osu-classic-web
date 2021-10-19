use wasm_bindgen::prelude::*;

#[wasm_bindgen(js_name = "parse")]
pub fn parse(content: &[u8]) -> Result<JsValue, JsValue> {
    let reader_len = content.len() as u32;
    let reader = std::io::Cursor::new(content);
    let osz2_file = osz2::parse(reader, reader_len); //.map_err(|e| JsValue::from_str(&e.to_string()))?;
    JsValue::from_serde(&osz2_file).map_err(|e| JsValue::from_str(&e.to_string()))
}
