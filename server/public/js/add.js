const storeForm = document.getElementById('store-form');
const storeId = document.getElementById('store-id');
const storeAddress = document.getElementById('store-address');
const descr = document.getElementById('descr');


async function addStore(e){
e.preventDefault();

if(storeId === '' || storeAddress ==='')
{
  alert('Please fill the form');
}

const sendBody = {
    userId: storeId.value,
    address: storeAddress.value,
    descr: descr.value

}

try{

    const res = await fetch('/api/redFlags', { 
    method: 'POST',     
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify(sendBody)    
});

alert(' RedFlag added');
window.location.href='/index.html';

}catch(err){
alert(err);
}


}

storeForm.addEventListener('submit', addStore);
