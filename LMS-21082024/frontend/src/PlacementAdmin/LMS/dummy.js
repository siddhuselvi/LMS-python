//importing bootstrap 5 css
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
function Popup() {
  return (
    <div>
      
        <div className="container mt-5">
          <h1 className="text-center">Therichpost.com</h1>
        </div>
        <div class="container p-5">
  
  <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
    Open PDF
  </button>
  
 
  <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl">
      <div class="modal-content" style={{height:"500px"}}>
        <div class="modal-header">
          {/* <h5 class="modal-title text-danger" id="exampleModalLabel">PDF</h5> */}
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
        <iframe src="https://1drv.ms/p/c/ede4d2824c6aa811/IQMRqGpMgtLkIIDtUAEAAAAAAVswL-LtRmOa0h4JpPYJx9Y" width="1000" height="600" frameborder="0" scrolling="no"></iframe>   </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-warning" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
  </div>
     
      
    </div>
  );
}

export default Popup;