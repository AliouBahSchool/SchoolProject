function REST(endpoint,data,method){
    var REST = new XMLHttpRequest();
    REST.open(method, endpoint, true);
    REST.send(data);
    return REST.response
};
function db(query){
    const res = REST('/database',query,'GET');
    return res;
};
function search(query){
    const search = db("SELECT FROM 'store' WHERE 'name' LIKE '"+query+"'");
    return search;
};
function StoreSearch(){
    searchBar = document.getElementById('SearchBar')
    const res = db(searchBar)
    console.log(res)
}