<?php
class BoatApi {
	public function __construct($rokortApi) {
		$this->rokortApi = $rokortApi;
	}

	public function get_all() {
		$boats = array();

		$rows = $this->rokortApi->query("553f62ec3c84c");

		for($i = 1; $i < $rows->length; $i++) {
			$cells = $rows[$i]->getElementsByTagName("td");

			$boats[] = array(
				"id" => trim($cells[0]->textContent),
				"name" => trim($cells[1]->textContent)
			);
		}

		return $boats;
	}

	private $rokortApi;
}