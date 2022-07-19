import "../css/style.scss";
import "../img/1.jpg";

function importAll(r) {
    let images = {};
    r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
    return images;
  }
  
const images = importAll(require.context('../img', false, /\.(png|jpe?g|svg)$/));

