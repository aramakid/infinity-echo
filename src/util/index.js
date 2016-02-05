
const regexp = /(^|\s)((?:#|＃)[^\s#＃]+)(?!#|＃)(?=\s|$)/g
export function findTags(text){
  const tags = []
  var match
  while((match = regexp.exec(text)) != null){
    tags.push(match[2])
  }
  return tags;
}

export function hashCode(text){
  if(typeof text !== 'string' || text.length === 0){
    return 0
  }
  var hash = 0
  for(let i = 0; i < text.length; i++){
    hash = 31 * hash + text.charCodeAt(i)
  }
  return Number.parseFloat(hash).toString(36)
}

export function addTagLink(text){
  return text.replace(regexp, (all, blank, tag) => {
    const hash = hashCode(tag)
    const to = `/tags/${hash}`
    return `${blank}[${tag}](${to})`
  })
}
