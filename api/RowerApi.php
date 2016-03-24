<?php
class RowerApi {
	public function __construct($rokortApi) {
		$this->rokortApi = $rokortApi;
	}

	public function get_all() {
		$rowers = array();

		$rows = $this->rokortApi->query("553f63b060231");
		
		for($i = 1; $i < $rows->length; $i++) {
			$cells = $rows[$i]->getElementsByTagName("td");

			$rowers[] = array(
				"id" => trim($cells[0]->textContent),
				"name" => trim($cells[1]->textContent)
			);
		}

		return $rowers;
	}

	private $rokortApi;
}