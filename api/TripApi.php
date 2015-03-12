<?php
class TripApi {
	public function __construct($rokortApi) {
		$this->rokortApi = $rokortApi;
	}

	public function get_by_rower($rower, $season) {
		$trips = array();

		$response = $this->rokortApi->get("/workshop/member.php?id=$rower&index=all&season=$season");

		libxml_use_internal_errors(true);
		$doc = new DOMDocument();
		$doc->loadHTML($response);

		$rows = $doc->getElementsByTagName("table")[1]->getElementsByTagName("tr");

		for($i = 1; $i < $rows->length; $i++) {
			$cells = $rows[$i]->getElementsByTagName("td");
			preg_match('/row\.php\?id=(\d+)/', $rows[$i]->attributes->getNamedItem("onclick")->textContent, $id);

			$trips[] = array(
				"id" => $id[1],
				"date" => $cells[0]->textContent,
				"distance" => $cells[5]->textContent,
				"total" => $cells[6]->textContent
			);
		}

		return $trips;
	}

	public function add($boat, $rower, $distance, $description) {
		$boat = urlencode($boat);
		$rower = urlencode($rower);
		$distance = urlencode($distance);
		$description = urlencode($description);

		$start = urlencode(date('d-m-Y H:i', strtotime('-1 hour -30 minutes', strtotime('now'))));
		$end = urlencode(date('d-m-Y H:i'));

		return $this->rokortApi->post(
			"/workshop/row_update.php",
			"action=update&BoatID=$boat&Description=$description&StartDateTime=$start&EndDateTime=$end&Distance=$distance&rower_list=%7E$rower&Completed=1"
		);
	}

	public function delete($id) {
		$id = urlencode($id);
		$start = urlencode(date('d-m-Y H:i'));

		return $this->rokortApi->post(
			"/workshop/row_update.php",
			"action=delete&StartDateTime=$start&ID=$id"
		);
	}

	private $rokortApi;
}