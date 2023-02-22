<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Thread List</title>
    <link rel=icon href=wakaba.ico>
    <link rel="stylesheet" type="text/css" href="css/reimu red.css">
    <style>
      body {
        margin: 0;
        padding: 0;
      }
      table {
        margin: 0 auto;
        margin-bottom: 20px;
        border-collapse: collapse;
        border-spacing: 0;
        width: 60%;
      }
      th, td {
        padding: 10px;
        border: 1px solid black;
        text-align: left;
        vertical-align: top;
      }
      th {
        background-color: #f2b0a9;
        width: 20%;
      }
      td.comment {
        background-color: #edc;
        width: 80%;
      }
      td.thread-number {
        background-color: #cec;
        width: 20%;
      }
      .home-link {
        text-align: right;
        margin-top: 8px;
        margin-right: 8px;
        font-size: 16px;
      }
      h1 {
        text-align: center;
        font-size: 28px;
        font-weight: bold;
        line-height: 100px;
      }
    </style>
  </head>
  <body>
   <div class="home-link">
    [<a href="/">Home</a>]
    [<a href="/faq.html">FAQ</a>]
    [<a href="/wakaba">Wakaba</a>]
    [<a href="/wakaba/wakaba.pl?task=admin">Manage</a>]
   </div>
    <h1>Thread List</h1>
    <table>
      <tbody>
        <!-- List all threads from /res/ folder in descending last modified order so the most recently posted in thread appears at the top. -->
        <?php
        $dir = "res/";
        $thumb_dir = "thumb/";
        $files = scandir($dir);
        usort($files, function($a, $b) use ($dir) {
            return filemtime($dir . $b) - filemtime($dir . $a);
        });
        
        $page = isset($_GET['page']) ? max(intval($_GET['page']), 1) : 1;
        $items_per_page = 10;
        $offset = ($page - 1) * $items_per_page;
        $total_items = count($files) - 2;
        $total_pages = ceil($total_items / $items_per_page);
        
        if ($total_pages > 1) {
            echo "<div style=\"text-align: center;\">";
            if ($page > 1) {
                echo "<a href=\"?page=" . ($page - 1) . "\">Previous</a> ";
            }
            for ($i = 1; $i <= $total_pages; $i++) {
                if ($i == $page) {
                    echo "$i ";
                } else {
                    echo "<a href=\"?page=$i\">$i</a> ";
                }
            }
            if ($page < $total_pages) {
                echo "<a href=\"?page=" . ($page + 1) . "\">Next</a>";
            }
            echo "</div>";
        }
        
        echo "<table>";
        echo "<tr>";
        echo "<th>Title</th>";
        echo "<th>Comment</th>";
        echo "</tr>";
        for ($i = $offset; $i < $offset + $items_per_page && $i < $total_items; $i++) {
            $file = $files[$i + 2];
            if (preg_match('/^(\d+)\.html$/', $file, $matches)) {
                $thread_number = $matches[1];
                $thread_title = "";
                $comment = "No comment.";
                $content = file_get_contents($dir . $file);
                if (preg_match('/<span class="filetitle">(.*?)(<a href="(.*?)">.*?<\/a>)?<\/span>/', $content, $matches)) {
                    if (isset($matches[1])) {
                        $thread_title = $matches[1];
                    }
                    if (isset($matches[2])) {
                        $thread_link = $matches[2];
                    } else {
                        $thread_link = $dir . $file;
                    }
                    preg_match('/<img src="(.*?)" class="thumb"/', $content, $matches);
                    $thumb_path = $thumb_dir . basename($matches[1]);
                } else {
                    $thread_link = $dir . $file;
                    $thumb_path = "";
                }
                preg_match('/<p>(.*?)<\/p>/', $content, $matches);
                if (isset($matches[1])) {
                    $comment = $matches[1];
                }
                echo "<tr>";
                echo "<td class=\"thread-number\">";
                if (!empty($thumb_path)) {
                    echo "<img src=\"$thumb_path\" alt=\"\" style=\"vertical-align:middle; margin-right:5px;\">";
                }
                echo "<a href=\"$thread_link\">";
                if (empty(trim($thread_title))) {
                    echo ">>$thread_number";
                } else {
                    echo $thread_title;
                }
                echo "</a></td>";
                echo "<td class=\"comment\">$comment</td>";
                echo "</tr>";
            }
        }
        echo "</table>";
        ?>
      </tbody>
    </table>
    <p class="footer"> - <a href="https://wakaba.c3.cx/">wakaba 3.0.9</a> + <a href="https://github.com/kimeemaru/wakaba/">teen spirit</a> + <a href="https://ota-ch.com/jp/">all my friends</a> -</p>
  </body>
</html>