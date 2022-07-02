import express from "express";
export class Model {
    constructor() {
        this.app = express.Router()
    }

    router() {
        return this.app
    }

    get(_callback) {
        this.app.get('/',_callback)
    }

    created(_callback) {
        this.app.post('/',_callback)
    }

    updated(_callback) {
        this.app.put('/:code',_callback)
    }

    delete(_callback) {
        this.app.delete('/:code',_callback)
    }
}