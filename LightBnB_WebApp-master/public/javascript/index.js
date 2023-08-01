$(() => {
  getAllListings().then(function( json ) {
    console.log("geAllListings json", json)
    propertyListings.addProperties(json.properties);
    views_manager.show('listings');
  });
});