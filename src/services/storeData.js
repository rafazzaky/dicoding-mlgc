const { Firestore } = require('@google-cloud/firestore');
 
async function storeData(id, data) {
  const db = new Firestore();
 
  const predictCollection = db.collection('prediction');
  return predictCollection.doc(id).set(data);
}
 
async function getData(){
    const db = new Firestore();
    const predictCollection = db.collection('prediction');
    const querySnapshot = await predictCollection.get();

    const data = [];
    querySnapshot.forEach(doc => {
        data.push(doc.data());
    });

    return data;
}
module.exports = { storeData, getData };