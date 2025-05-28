const breadcrumbContainer = document.getElementById("breadcrumb");

// Split current URL path
let path = window.location.pathname.split("/").filter(Boolean);

let breadcrumbHTML = `<a href="/home.html">Home</a>`; // FIXED

let fullPath = "";
for (let i = 0; i < path.length; i++) {
  fullPath += "/" + path[i];

  if (i === path.length - 1) {
    breadcrumbHTML += ` <span>|</span> <span class="current">${decodeURIComponent(path[i].replace(".html", "").replace(/-/g, " "))}</span>`;
  } else {
    breadcrumbHTML += ` <span>|</span> <a href="${fullPath}">${decodeURIComponent(path[i].replace(/-/g, " "))}</a>`;
  }
}

breadcrumbContainer.innerHTML = breadcrumbHTML;
