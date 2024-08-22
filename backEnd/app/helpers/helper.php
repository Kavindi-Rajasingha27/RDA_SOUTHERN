<?php
use Illuminate\Support\Facades\DB;


if (!function_exists('generate_id')) {
	function generateId($prefix = '', $tbl_nme = '', $field = '', $numbof_chars = '5', $pad_sym = '0')
	{

		$yr    = date("y");
		$query = DB::table($tbl_nme)
		->select(DB::raw('IFNULL( MAX(' . $field . '), 0) as id'))
		->where($field, 'like', $prefix . $yr . '%')
		->first();


		if (!empty($query->id)) {
			$gen_id = substr($query->id, strlen($prefix) + 2, 7);
		} else {
			$gen_id = '0';
		}

		$max_id = ++$gen_id;
		return $prefix . $yr . str_pad($max_id, $numbof_chars, $pad_sym, STR_PAD_LEFT);

	}
}

?>
