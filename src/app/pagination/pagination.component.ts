import { Component, OnInit, Input, Output, SimpleChanges, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {
  total: Array<any> = [];
  @Input() currentPage1:number;
  @Input() pageCount1:number;
  @Output() callPerent = new EventEmitter<number>();
  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if(this.pageCount1){
      if(this.pageCount1 > 1)
      {
        // console.log('callded',1);
        let pageCount1 = this.pageCount1;
        let currentPage1 = this.currentPage1
        if(pageCount1 < 5){
          this.total = Array(pageCount1).fill(1).map((x,i)=>i+1); // [0,1,2,3,4]
        }else if(currentPage1===1 || currentPage1==2){
          this.total = [currentPage1,currentPage1+1,currentPage1+2,"...",pageCount1];
        }else if(currentPage1===pageCount1 || currentPage1===pageCount1-1){
          this.total = [1,"...",pageCount1-2,pageCount1-1,pageCount1];
        }else if(currentPage1 > 2 && currentPage1 < (pageCount1-1)){
          this.total = [1,"...",currentPage1-1,currentPage1,currentPage1+1,"...",pageCount1];
        } else if(currentPage1 > (pageCount1-1)){
          this.total = [1,"...",pageCount1-2,pageCount1-1,pageCount1];
        }
      }
    }
  }
  call_page(pageno){
    if(pageno!=='...')
      this.callPerent.emit(parseInt(pageno));
  }
}
