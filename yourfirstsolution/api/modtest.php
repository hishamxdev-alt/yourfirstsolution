<?php
if (in_array('mod_rewrite', apache_get_modules())) {
    echo "mod_rewrite is ENABLED";
} else {
    echo "mod_rewrite is NOT enabled";
}
?>