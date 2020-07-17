window.addEventListener('DOMContentLoaded', (event) => {
    let productsObj = {
        "cart": {
            "products": {},
            "count": 0
        }
    }

    const xmlhttp = new XMLHttpRequest()
    const url = "./ListJSONTest.json"

    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            const data = JSON.parse(this.responseText)
            createProdObj(data.List)
            listProducts()
            setEventListeners()
        }
    };
    xmlhttp.open("GET", url, true)
    xmlhttp.send()
    
    const listProducts = () => {
        let product = ''
        productsObj.list.forEach(e => {
            product += `
                <article class="product">
                    <section class="section-product-container">
                        <section class="section-image">
                            <a href=${e.productUrl}>
                                <img src=${e.mediumImageURL} alt='${e.caption}'>
                            </a>
                        </section>
                        <section class="section-details">
                            <a href=${e.productUrl}>
                                <div class="product-title">${e.caption}</div>
                                <div class="product-brand">${e.brand}</div>
                                <div class="product-price">${e.currency}${e.price}</div>
                            </a>
                        </section>
                    </section>
                    <section class="section-add-to-cart">
                        <button class="add-to-cart" data=${e.prodId}>Add to Cart</button>
                    </section>
                </article>
            `
        });
        
        document.getElementById('products').innerHTML = product

        Array.from(document.getElementsByClassName('add-to-cart')).forEach(elem => {
            elem.addEventListener('click', (e) => {
                const prodId = elem.getAttribute('data')
                addToCart(prodId)
            })
        })
    }

    const createProdObj = (productsJson) => {
        productsObj.list = productsJson.map(e => Object.assign({}, e))
    }

    const sortProducts = (sortRequest) => {
        
        const titleAsc = () => {
            productsObj.list.sort((a, b) => {
                let prod1 = a.caption.toUpperCase()
                let prod2 = b.caption.toUpperCase()
                if (prod1 < prod2) {
                    return -1
                }
                if (prod1 > prod2) {
                    return 1
                }
            })
        }

        const titleDes = () => {
            productsObj.list.sort((a, b) => {
                let prod1 = a.caption.toUpperCase()
                let prod2 = b.caption.toUpperCase()
                if (prod1 > prod2) {
                    return -1
                }
                if (prod1 < prod2) {
                    return 1
                }
            })
        }
        const brandAsc = () => {
            productsObj.list.sort((a, b) => {
                let prod1 = a.brand.toUpperCase()
                let prod2 = b.brand.toUpperCase()
                if (prod1 < prod2) {
                    return -1
                }
                if (prod1 > prod2) {
                    return 1
                }
            })
        }

        const brandDes = () => {
            productsObj.list.sort((a, b) => {
                let prod1 = a.brand.toUpperCase()
                let prod2 = b.brand.toUpperCase()
                if (prod1 > prod2) {
                    return -1
                }
                if (prod1 < prod2) {
                    return 1
                }
            })
        }

        const priceAsc = () => {
            productsObj.list.sort((a, b) => a.price - b.price)
        }

        const priceDes = () => {
            productsObj.list.sort((a, b) => b.price - a.price)
        }

        const availability = () => {
            productsObj.list.sort((a, b) => b.isAvailable - a.isAvailable)
        }

        switch(sortRequest) {
            case 'titleAsc':
                titleAsc()
                break;
            case 'titleDes':
                titleDes()
                break;
            case 'brandAsc':
                brandAsc()
                break;
            case 'brandDes':
                brandDes()
                break;
            case 'priceAsc':
                priceAsc()
                break;
            case 'priceDes':
                priceDes()
                break;
            case 'availability':
                availability()
                break;
        }

        listProducts()

    }

    const getProdDetails = (prodId) => {
        for (let i = 0; i < productsObj.list.length; i++) {
            if (productsObj.list[i].prodId == prodId) {
                return {
                    'title': productsObj.list[i].caption,
                    'price': productsObj.list[i].price,
                    'image': productsObj.list[i].mediumImageURL,
                    'currency': productsObj.list[i].currency,
                    'prodId': prodId
                }
            }
        }
    }

    const addToCart = (prodId) => {
        if (productsObj.cart.products[prodId]) {
            productsObj.cart.products[prodId].quantity += 1
        } else {
            productsObj.cart.products[prodId] = getProdDetails(prodId)
        }

        document.getElementById('modal-added-to-cart').style.display = 'flex'
    }

    const removeFromCart = (prodId) => {
        delete productsObj.cart.products[prodId]
        showCart()
    }

    const showCart = () => {
        let cartHtml = ''
        for (let [key, val] of Object.entries(productsObj.cart.products)) {
            cartHtml += `
                <article class="cart-product">
                    <section class="cart-product-img">
                        <img src=${val.image} alt='${val.title}'>
                    </section>
                    <section class="cart-product-details">
                        <div class="cart-product-title">${val.title}</div>
                        <div class="cart-product-price">${val.currency}${val.price}</div>
                        <button class="cart-product-remove" data=${val.prodId}>Remove</div>
                    </section>
                </article>
            `
        }

        document.getElementById('cart-products').innerHTML = cartHtml
        document.getElementById('cart').style.display = 'block'
        
        document.getElementById('close-cart').addEventListener('click', () => {
            document.getElementById('cart').style.display = 'none'
        })

        Array.from(document.getElementsByClassName('cart-product-remove')).forEach(elem => {
            elem.addEventListener('click', (e) => {
                const prodId = elem.getAttribute('data')
                removeFromCart(prodId)
            })
        })
    }

    const setEventListeners = () => {
        Array.from(document.getElementsByName('sort')).forEach(elem => {
            elem.addEventListener('click', () => {
                const sortOption = elem.getAttribute('value')
                sortProducts(sortOption)
            })
        })

        Array.from(document.getElementById('sort-types').children).forEach(elem => {
            elem.addEventListener('click', () => {
                elem.children[0].click()
                document.getElementsByClassName('sort-modal-background')[0].classList.remove('show')
                setTimeout(() => {
                    document.getElementById('modal-sort').style.display = 'none'
                }, 100);
            })
        })
        
        document.getElementById('section-sort').addEventListener('click', (e) => {
            document.getElementById('modal-sort').style.display = 'block'
            setTimeout(() => {      
                document.getElementsByClassName('sort-modal-background')[0].classList.add('show')
            }, 1);
        })
        
        document.getElementById('close-sort').addEventListener('click', (e) => {
            document.getElementsByClassName('sort-modal-background')[0].classList.remove('show')
            setTimeout(() => {
                document.getElementById('modal-sort').style.display = 'none'
            }, 100);
        })

        document.getElementById('cart-icon').addEventListener('click', showCart)
        
        document.getElementById('keep-shopping').addEventListener('click', () => {
            document.getElementById('modal-added-to-cart').style.display = 'none'
        })

        document.getElementById('view-cart').addEventListener('click', () => {
            document.getElementById('modal-added-to-cart').style.display = 'none'
            showCart()
        })
    }
})