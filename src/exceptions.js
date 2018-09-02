class ResourceNotFound extends Error {}
class InvalidJsonFormat extends Error {}

module.exports = {
    ResourceNotFound: ResourceNotFound,
    InvalidJsonFormat: InvalidJsonFormat
}