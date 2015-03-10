<?php
// Slim Framework
require 'Slim/Slim.php';
\Slim\Slim::registerAutoloader();
$app = new \Slim\Slim();


// Rokort API
require 'user.php'; // Set $username and $password in user.php
$rokortApi = new RokortApi($username, $password);
$tripApi = new TripApi($rokortApi);


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


// Delete a trip
$app->delete('/trip/:id', function ($id) use ($tripApi) {
    $tripApi->delete($id);
});


$app->run();