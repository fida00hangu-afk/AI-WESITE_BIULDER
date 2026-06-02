const extractJson = async (text) => {
    if (!text) {
        return
    }
    const cleaned = text.replace(/``` json/gi, "").replace(/``` /g, "").trim()
    const firstBrace = cleaned.indexOf('{')
    const closeBrace = cleaned.lastIndexOf('}')
    if (firstBrace === -1 || closeBrace === -1) return
    const JsonString = cleaned.slice(firstBrace, closeBrace + 1)
    return JSON.parse(JsonString)
}
export default extractJson

