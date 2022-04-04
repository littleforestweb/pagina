const {got} = require('./http-client')
const iconv = require('iconv-lite')

module.exports = getPage

async function getPage({url, requestMethod}) {
    const {content, error} = await request(url, requestMethod,)

    if (error) {
        return {contents: "null"}
    }

    return {contents: content.toString()}
}

async function request(url, requestMethod) {
    try {
        const options = {method: requestMethod}
        const response = await got(url, options)

        return {response: response, content: response.body}
    } catch (error) {
        return {error}
    }
}