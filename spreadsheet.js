function successFunc(data) {
  console.log(data);
}

Sheetsu.read(
  "https://sheetsu.com/apis/v1.0lw/020b2c0f/",
  {},
  successFunc
);