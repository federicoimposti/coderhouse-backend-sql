const fs = require('fs');
const error = { error: 'Producto no encontrado' };

let products = [];

module.exports = class Controller {
    constructor(knex, table) {
        this.knex = knex;
        this.table = table;
    }

    async save(obj) {
        try {
            await this.knex(this.table)
                    .insert(obj)
                    .then(() => {
                        console.log("Product inserted");
                    })
                    .catch((err) => {
                        console.log(err);
                    })
        } catch (err) {
            throw new Error('Ocurrió un error al guardar el producto.', err);
        }
    }

    static getById(id) {
        try {
            if (!products) {
                return error;
            }

            const product = products.find(product => product.id === id);
            return product ? product : error;
        } catch (err) {
            throw new Error('Ocrrió un error obteniendo el producto.', err);
        }
    }

    async getAll() {
        try {
            return await this.knex
                .from(this.table)
                .select("*")
                .then(products => products ? products : null)
                .catch((err) => {
                    console.log(err);
                })
        } catch(err) {
            throw new Error('Ocurrió un error obteniendo los productos.', err);
        }
    }

    static deleteById(id) {
        try {
            if (!products) {
                return error;
            }

            const product = this.getById(id);
        
            if(product?.id){
                const productsFiltered = products.filter(product => product.id !== id);
                products = productsFiltered;
                return productsFiltered;
            } else {
                return error;
            }
            
        } catch (err) {
            throw new Error('Ocurrió un error eliminando el producto.', err);
        }
        
    }

    async deleteAll() {
        try {
            await fs.promises.writeFile(this.file, JSON.stringify([], null, 2));
        } catch (err) {
            throw new Error ('Ocurrió un error eliminando los productos.', err);
        }
        
    }

    static update(id, newData) {
        try {
            const { title, price, thumbnail } = newData;
            const productId = id;

            const product = this.getById(productId);
        
            if(product?.id){
                products.forEach(product => {
                    const id = product.id;
                    if(productId === id){
                        product.title = title;
                        product.price = price;
                        product.thumbnail = thumbnail;
                    }
                });

                return product;
            } else {
                return error;
            }
        } catch (err) {
            throw new Error ('Ocurrió un error actualizando el producto.', err);
        }
      };
}
