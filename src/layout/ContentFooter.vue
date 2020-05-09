<template>
  <footer class="footer px-4">
	  <div class="row align-items-center justify-content-lg-between text-center">
		  <p style="width: 100%;">我就是恰饭之王</p>
		<ins class="adsbygoogle"
		     style="display:block;width: 100%;"
		     data-ad-client="ca-pub-7564284646329791"
		     data-ad-slot="7525727531"
		     data-ad-format="auto"
		     data-full-width-responsive="true"></ins>
	</div>
    <div class="row align-items-center justify-content-lg-between">
      <div class="col-lg-6">
        <div class="copyright text-center text-lg-left text-muted">
          © {{year}} <a href="https://rorical.blue" class="font-weight-bold ml-1" target="_blank">Rorical</a> on
          <a href="https://www.boxpaper.club" class="font-weight-bold ml-1" target="_blank">Boxpaper</a>
        </div>
      </div>
      <div class="col-lg-6">
        <ul class="nav nav-footer justify-content-center justify-content-lg-end">
          <li class="nav-item">
            <a href="https://blog.boxpaper.club/pixivel.aspx" class="nav-link" target="_blank">食用方法？</a>
          </li>
          <li class="nav-item">
            <a href="http://blog.boxpaper.club" class="nav-link" target="_blank">博客</a>
          </li>
        </ul>
      </div>
    </div>
  </footer>
</template>
<script>
export default {
  data() {
    return {
      year: new Date().getFullYear()
    };
  }
};
</script>
<style></style>
