<?php
class RokortApi {
	public function __construct($username, $password) {
		$this->login($username, $password);
	}

	public function get($url) {
		$handle = curl_init();
		
		$response = $this->request($handle, $url);

		curl_close($handle);

		$this->validateResponse($response);

		return $response;
	}

	public function post($url, $postfields) {
		$handle = curl_init();

		curl_setopt($handle, CURLOPT_HEADER, 1);
		curl_setopt($handle, CURLOPT_POST, 1);
		curl_setopt($handle, CURLOPT_POSTFIELDS, $postfields);

		$response = $this->request($handle, $url);

		curl_close($handle);

		$this->validateResponse($response);

		return $response;
	}

	/* Private */
	private function login($username, $password) {
		$username = urlencode($username);
		$password = urlencode($password);	

		$response = $this->post("/", "action=login&siteid=14&user_name=$username&password=$password&save_login=1");

		preg_match('/^Set-Cookie:\s*([^;]*)/mi', $response, $matches);

		$this->session_cookie = $matches[1];
	}

	private function request($handle, $url) {
		curl_setopt($handle, CURLOPT_URL, $this->host . $url);
		curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($handle, CURLOPT_HTTPHEADER, array(
			'Host: rokort.dk',
			'Connection: keep-alive',
			'Pragma: no-cache',
			'Cache-Control: no-cache',
			'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
			'Origin: http://rokort.dk',
			'User-Agent: Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36',
			'Content-Type: application/x-www-form-urlencoded',
			'Accept-Encoding: deflate',
			'Accept-Language: en-US,en;q=0.8,da;q=0.6,de;q=0.4',
			'Cookie: _siteid=14; ' . $this->session_cookie
		));

		return curl_exec($handle);
	}

	private function validateResponse($response) {
		if (strpos($response, 'Der kan ikke bygges SQL sætninger') !== false) {
			throw new Exception('Unauthorized');
		}
	}

	private $session_cookie = "";
	private $host = "http://www.rokort.dk";
}