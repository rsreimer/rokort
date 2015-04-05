<?php
class RokortApi {
	public function __construct($username, $password) {
		$this->login($username, $password);
	}

	public function get($url) {
		return $this->request($url);
	}

	public function post($url, $postfields) {
		return $this->request($url, array(
			CURLOPT_POSTFIELDS => $postfields
		));
	}

	/* Private */
	private function login($siteid, $guid) {
		$url = "/workshop/workshop.php?siteid=$siteid&guid=$guid";
		
		$response = $this->request($url, array(
			CURLOPT_HEADER => 1
		));

		// Grap session cookie from HTTP response header
		preg_match('/^Set-Cookie:\s*([^;]*)/mi', $response, $match);

		$this->session_cookie = $match[1];
	}

	private function request($url, $options = null) {
		$handle = curl_init();

		curl_setopt($handle, CURLOPT_URL, $this->host . $url);
		curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($handle, CURLOPT_HTTPHEADER, array(
			'Cookie: ' . $this->session_cookie
		));

		// Set extra options
		if ($options) {
			foreach ($options as $option => $value) {
				curl_setopt($handle, $option, $value);
			}
		}

		$response = curl_exec($handle);

		curl_close($handle);

		$this->validateResponse($response);

		return $response;
	}

	private function validateResponse($response) {
		if (strpos($response, 'Der kan ikke bygges SQL sætninger') !== false) {
			throw new Exception('Unauthorized');
		}
	}

	private $session_cookie = "";
	private $host = "http://www.rokort.dk";
}