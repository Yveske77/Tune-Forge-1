export function safeParse(json){
  try { return JSON.parse(json) } catch { return null }
}
export function loadJSON(key, fallback){
  const raw = localStorage.getItem(key)
  if(!raw) return fallback
  const obj = safeParse(raw)
  return obj ?? fallback
}
export function saveJSON(key, value){
  localStorage.setItem(key, JSON.stringify(value, null, 2))
}
