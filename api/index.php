<?php
// Slim Framework
require 'Slim/Slim.php';
\Slim\Slim::registerAutoloader();
$app = new \Slim\Slim();


// Rokort API
require 'authinfo.php'; // Set $siteid and $guid in authinfo.php
$rokortApi = new RokortApi($siteid, $guid);
$tripApi = new TripApi($rokortApi);
$rowerApi = new RowerApi($rokortApi);
$boatApi = new BoatApi($rokortApi);


// Add new trip
$app->post('/trip', function () use ($tripApi) {
	$app = \Slim\Slim::getInstance();

	$trip = json_decode($app->request()->getBody());

	$tripApi->add($trip->boat, $trip->rower, $trip->distance, $trip->description);
});


// Get a list of a rowers trips during the current and the last season
$app->get('/profile/:rower', function ($rower) use ($tripApi) {
    echo json_encode(array_merge(
    	$tripApi->get_by_rower($rower, date('Y')),
    	$tripApi->get_by_rower($rower, date('Y')-1)
    ));
});


// Get a list of all rowers
$app->get('/rower', function () use ($rowerApi) {
    echo json_encode($rowerApi->get_all());
});


// Get a list of all boats
$app->get('/boat', function () use ($boatApi) {
    echo json_encode($boatApi->get_all());
});


// Delete a trip
$app->delete('/trip/:id', function ($id) use ($tripApi) {
    $tripApi->delete($id);
});


$app->run();