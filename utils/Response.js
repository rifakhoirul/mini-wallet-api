class Response {
    constructor(data, status){
        this.status = status === undefined ? 'success' : status
        this.data = data || {}
    }
}

export default Response;