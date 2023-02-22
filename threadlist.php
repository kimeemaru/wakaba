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
      <thead>
        <tr>
          <th class="thread-number">Thread</th>
          <th>Comment</th>
        </tr>
      </thead>
      <tbody>
        <!-- List all threads from /res/ folder -->
        <?php
          $dir = "res/";
          $files = scandir($dir, SCANDIR_SORT_DESCENDING);
          foreach ($files as $file) {
            if (preg_match('/^(\d+)\.html$/', $file, $matches)) {
              $thread_number = $matches[1];
              $thread_title = "Thread $thread_number";
              $content = file_get_contents($dir . $file);
              if (preg_match('/<span class="filetitle">(.*?)(<a href="(.*?)">.*?<\/a>)?<\/span>/', $content, $matches)) {
                if (isset($matches[2])) {
                  $thread_title = $matches[2];
                  $thread_link = $matches[3];
                } else {
                  $thread_link = $dir . $file;
                }
              } else {
                $thread_link = $dir . $file;
              }
              preg_match('/<p>(.*?)<\/p>/', $content, $matches);
              $comment = $matches[1];
              echo "<tr>";
              echo "<td class=\"thread-number\"><a href=\"$thread_link\">$thread_title</a></td>";
              echo "<td class=\"comment\">$comment</td>";
              echo "</tr>";
            }
          }
        ?>
      </tbody>
    </table>
    <p class="footer"> - <a href="https://wakaba.c3.cx/">wakaba 3.0.9</a> + <a href="https://github.com/kimeemaru/wakaba/">teen spirit</a> + <a href="https://ota-ch.com/jp/">all my friends</a> -</p>
  </body>
</html>