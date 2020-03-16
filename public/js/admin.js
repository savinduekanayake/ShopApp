const deleteProduct = (btn)=>{
    // console.log('hi')
    const prodId = btn.parentNode.querySelector('[name=productId]').value;
    const csfr = btn.parentNode.querySelector('[name=_csrf]').value;
    // const prodId = btn.parentNode.querySector('[name=productId]').value;
    const productElement = btn.closest('article');

    console.log(btn)
    //send http request
    fetch('/admin/product/' + prodId, {
        method: 'DELETE',
        headers: {
            'csrf-token': csfr,
        }
    }).then(result=>{
        // console.log(result)
        return result.json()
    })
    .then(data=>{
        console.log(data)
        productElement.parentNode.removeChild(productElement);
    })
    .catch(err=> {console.log(err)})
}
