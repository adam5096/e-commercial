window.onload = function () {

    // 第5行代碼配合第4個(第111行)函數thumbNailClick()
    // 宣告一個紀錄點擊的縮圖索引值
    var bigImgIndex = 0;

    // 1_動態渲染導航標題文字
    navPathDataBind();
    function navPathDataBind() {
        var navPath = document.querySelector('#wrapper #content .contentMain #navPath');
        // console.log(navPath);
        var path = goodData.path;
        // console.log(path);
        for (var i = 0; i < path.length; i++) {
            if (i == path.length - 1) {
                var aNode = document.createElement('a');
                aNode.innerText = path[i].title;
                navPath.appendChild(aNode);

            } else {
                var aNode = document.createElement('a');
                aNode.href = path[i].url;
                aNode.innerText = path[i].title;
                var iNode = document.createElement('i');
                iNode.innerText = '/';

                navPath.appendChild(aNode);
                navPath.appendChild(iNode);
            }
        }
    }

    // 2_放大鏡移入、移出
    bigClassBind();
    function bigClassBind() {
        // onmouseover(有事件冒泡行為影響其父元素),onmouseenter(沒有冒泡行為)
        // onmouseleave
        var smallPic = document.querySelector('#wrapper #content .contentMain #center #left #leftTop #smallPic');
        var leftTop = document.querySelector('#wrapper #content .contentMain #center #left #leftTop');
        var imagessrc = goodData.imagessrc;


        smallPic.onmouseenter = function () {
            // console.log(smallPic);

            var maskDiv = document.createElement('div');
            maskDiv.className = 'mask';

            var bigPic = document.createElement('div');
            bigPic.id = 'bigPic';

            var bigImg = document.createElement('img');
            bigImg.src = imagessrc[bigImgIndex].b;
            bigImg.alt = 'chikorita';

            bigPic.appendChild(bigImg);

            smallPic.appendChild(maskDiv);
            leftTop.appendChild(bigPic);

            // 蓋版元素跟隨移滑鼠動事件
            smallPic.onmousemove = function (event) {
                var maskLeft = event.clientX - smallPic.getBoundingClientRect().left - (maskDiv.offsetWidth / 2);
                var maskTop = event.clientY - smallPic.getBoundingClientRect().top - (maskDiv.offsetHeight / 2);

                // 設定蓋板元素移動上、下、左、右邊界
                if (maskLeft < 0) { maskLeft = 0; }
                else if (maskLeft > smallPic.clientWidth - maskDiv.offsetWidth) { maskLeft = smallPic.clientWidth - maskDiv.offsetWidth; }

                if (maskTop < 0) { maskTop = 0; }
                else if (maskTop > smallPic.clientHeight - maskDiv.offsetHeight) { maskTop = smallPic.clientHeight - maskDiv.offsetHeight; }


                maskDiv.style.left = maskLeft + 'px';
                maskDiv.style.top = maskTop + 'px';

                // 大、小圖移動比關係
                var scale = (smallPic.clientWidth - maskDiv.offsetWidth) / (bigImg.offsetWidth - bigPic.clientWidth);
                // console.log(scale);
                bigImg.style.left = -(maskLeft / scale) + 'px';
                bigImg.style.top = -(maskTop / scale) + 'px';
            }

            smallPic.onmouseleave = function () {
                smallPic.removeChild(maskDiv);
                leftTop.removeChild(bigPic);
            }

        }
    }

    // 3_動態渲染放大鏡縮略圖數據
    thumbNailData();
    function thumbNailData() {
        // goodData.imagessrc.s

        var ul = document.querySelector('#wrapper #content .contentMain #center #left #leftBottom #picList ul');
        // console.log(ul);
        var imagessrc = goodData.imagessrc;
        //  console.log(imagessrc);
        for (var i = 0; i < imagessrc.length; i++) {
            var newLi = document.createElement('li');
            var newImg = document.createElement('img');
            newImg.src = imagessrc[i].s;
            newLi.appendChild(newImg);
            ul.appendChild(newLi);
        }
    }

    // 4_點擊縮略圖效果
    thumbNailClick();
    function thumbNailClick() {
        // 取得所有li元素，並且循環發生點擊事件
        // 點擊縮略圖需要確定其索引位置來找到對應的小圖路徑與大圖路徑替換現有src值

        var liNodes = document.querySelectorAll('#wrapper #content .contentMain #center #left #leftBottom #picList ul li');
        // console.log(liNodes);

        var smallPicImg = document.querySelector('#wrapper #content .contentMain #center #left #leftTop #smallPic img');
        var imagessrc = goodData.imagessrc;

        // 小圖路徑預設要與imagessrc[0].s路徑一致
        smallPicImg.src = imagessrc[0].s;

        for (var i = 0; i < liNodes.length; i++) {

            liNodes[i].indexForImgAddress = i;
            liNodes[i].onclick = function () {
                // console.log(this.indexForImgAddress);
                var idx = this.indexForImgAddress;
                bigImgIndex = idx;

                smallPicImg.src = imagessrc[idx].s;
            }
        }
    }

    // 5_點擊縮略圖左右箭頭效果
    thumbNailleftRightClick();
    function thumbNailleftRightClick() {
        // 計算輪播圖起點、步長、總運動距離值
        var prev = document.querySelector('#wrapper #content .contentMain #center #left #leftBottom a.prev');
        var next = document.querySelector('#wrapper #content .contentMain #center #left #leftBottom a.next');
        // console.log(prev,next);
        // var picList = document.querySelector('#wrapper #content .contentMain #center #left #leftBottom #picList');
        var ul = document.querySelector('#wrapper #content .contentMain #center #left #leftBottom #picList ul');
        var liNodes = document.querySelectorAll('#wrapper #content .contentMain #center #left #leftBottom #picList ul li');
        // console.log(ul);// console.log(picList);// console.log(liNodes);

        // 起點,當前累加運動距離,也是座標值
        var start = 0;
        // 步長
        var step = (liNodes[0].offsetWidth + 19) * 2;
        // 最大總運動距離值 = ul寬度-div寬度=(圖片總數-div中可見圖片數)*(圖寬+間距20px)
        var totalMovementLength = (liNodes.length - 5) * (liNodes[0].offsetWidth + 19);

        prev.onclick = function () {
            start -= step;
            if (start < 0) {
                start = 0;
            }
            ul.style.left = -start + 'px';
        }
        next.onclick = function () {
            start += step;
            if (start > totalMovementLength) {
                start = totalMovementLength;
            }
            ul.style.left = -start + 'px';
        }

    }

    // 6_商品詳情數據動態渲染
    rightTopData();
    function rightTopData() {
        // 取得rightTop元素
        // 取得data.js>goodData.goodDetail
        // 建立一字串變數，將原來結構貼進來，將對應數據在對應位置上重新渲染rightTop元素

        var rightTop = document.querySelector('#wrapper #content .contentMain #center .right .rightTop');
        // console.log(rightTop);

        var goodDetail = goodData.goodDetail;
        // console.log(goodDetail);
        // ${變數}
        var s = `<h3>${goodDetail.title}</h3>
        <p>${goodDetail.recommend}</p>
        <div class="priceWrap">
            <div class="priceTop">
                <div class="containerForFlexItem">
                    <span>價&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;格</span>
                    <div class="price">
                        <span>羊</span>
                        <p>${goodDetail.price}</p>
                        <i>降價通知</i>
                    </div>
                </div>
                <p>
                    <span>累計評價</span>
                    <span>670000</span>
                </p>
            </div>
            <div class="priceBottom">
                <span>促&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;銷</span>
                <p>
                    <span>${goodDetail.promoteSales.type}</span>
                    <span>${goodDetail.promoteSales.content}</span>
                </p>
            </div>
        </div>
        <div class="support">
            <span>支&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;持</span>
            <p>${goodDetail.support}</p>
        </div>
        <div class="address">
            <span>配&nbsp;&nbsp;送&nbsp;&nbsp;至</span>
            <p>${goodDetail.address}</p>
        </div>`;

        rightTop.innerHTML = s;
    }

    // 7_商品規格選擇區動態渲染
    rightBottomData();
    function rightBottomData() {

        // 取得chooseWrap元素節點
        // 取得goodData.goodDetail.crumbData數據
        // 由於數據是陣列形式包裹，需用for遍歷，每一元素須有一個動態dl元素節點(dt,dd)

        var chooseWrap = document.querySelector('#wrapper #content .contentMain #center .right .rightBottom .chooseWrap');
        // console.log(chooseWrap);
        var crumbData = goodData.goodDetail.crumbData;
        // console.log(crumbData);

        // 遍歷dl數據(crumbData.title)
        for (var i = 0; i < crumbData.length; i++) {
            var dlNode = document.createElement('dl');
            var dtNode = document.createElement('dt');
            dtNode.innerText = crumbData[i].title;

            // 此句dlNode要在這位置，如放到246的for之後，新渲染的html結構會不如預期
            dlNode.appendChild(dtNode);

            // 遍歷dl中的dd數據(crumbData.data)
            for (var j = 0; j < crumbData[i].data.length; j++) {
                var ddNode = document.createElement('dd');
                ddNode.innerText = crumbData[i].data[j].type;
                // 新增屬性名、值，以利第9個功能函數changePriceBind()取用
                ddNode.setAttribute('price', crumbData[i].data[j].changePrice);

                dlNode.appendChild(ddNode);
            }

            chooseWrap.appendChild(dlNode);
        }
    }

    // 8_點擊商品規格後顏色排他效果
    clickddBind();
    function clickddBind() {
        // 取得全部dl元素(取回後會以陣列保存)，取其中第一個dl下的所有dd先測試，
        // 測完後在對應的dl索引值前再套一for循環，目的在變換索引值
        // 循環所有dd並綁定點擊事件
        // 確定實際發生事件的目標源物件設置其文字顏色為紅色，給其他所有元素顏色重置成基礎顏色
        // 把for循環中的i給留存
        var dlNodes = document.querySelectorAll('#wrapper #content .contentMain #center .right .rightBottom .chooseWrap dl');
        // console.log(dlNodes[0]);
        // console.log(ddnodes);
        var arrClickddForShow = new Array(dlNodes.length);
        var choose = document.querySelector('#wrapper #content .contentMain #center .right .rightBottom .choose');
        // console.log(arrClickdd);
        arrClickddForShow.fill(0);
        // console.log(arrClickdd);//[0,0,0,0]


        for (var i = 0; i < dlNodes.length; i++) {
            // 立即執行函數,閉包,解決循環事件中的變數問題,把for循環中的i給留存
            (function (i) {
                var ddNodes = dlNodes[i].querySelectorAll('dd');
                // console.log(ddNodes);
                for (var j = 0; j < ddNodes.length; j++) {
                    // ddnodes[i].index = i;
                    ddNodes[j].onclick = function () {
                        // console.log(this);
                        // 清空choose元素
                        choose.innerHTML = '';
                        for (var k = 0; k < ddNodes.length; k++) {
                            ddNodes[k].style.color = '#666';
                        }
                        this.style.color = 'red';

                        //點擊dd渲染一新mark元素
                        // console.log(this.innerText);
                        arrClickddForShow[i] = this;
                        // console.log(arrClickdd);

                        // function_9
                        changePriceBind(arrClickddForShow);

                        // 遍歷arrClickdd，將非0元素寫入mark節點
                        arrClickddForShow.forEach(function (value, index) {
                            if (value) {
                                var markDiv = document.createElement('div');
                                markDiv.className = 'mark';
                                markDiv.innerText = value.innerText;

                                var aNode = document.createElement('a');
                                aNode.innerText = 'X';
                                // aNode.indexForDlt = index;
                                aNode.setAttribute('indexForDlt', index);

                                markDiv.appendChild(aNode);
                                choose.appendChild(markDiv);
                            }
                        })

                        // 取得所有a節點並循環綁定點擊事件
                        var aNodesForDlt = document.querySelectorAll('#wrapper #content .contentMain #center .right .rightBottom .choose .mark a');
                        // console.log(aNodesForDelete);
                        for (var n = 0; n < aNodesForDlt.length; n++) {
                            aNodesForDlt[n].onclick = function () {
                                // 取得當前點擊a身上的indexForDlt值
                                var idxtmp = this.getAttribute('indexForDlt');
                                // console.log(idxtmp);

                                arrClickddForShow[idxtmp] = 0;
                                // console.log(arrClickddForShow);

                                var ddNodeForRstColor = dlNodes[idxtmp].querySelectorAll('dd');
                                // console.log(ddNodeForRstColor);

                                // 遍歷ddNodeForRstColor並重置顏色
                                for (var m = 0; m < ddNodeForRstColor.length; m++) {
                                    ddNodeForRstColor[m].style.color = '#666';
                                }

                                ddNodeForRstColor[0].style.color = 'red';

                                // 刪除所點dd對應索引值mark節點
                                choose.removeChild(this.parentNode);

                                // 呼叫價格變動函數，點擊刪除時要出現總價減少
                                // function_9
                                changePriceBind(arrClickddForShow);
                            }
                        }
                    }
                }
            })(i)
        }

        // 點擊dd渲染一新mark元素
        // 建立一新容器arrClickddForShow，容納點擊dd元素內容器(陣列)，確定陣列長度，再加一些預設值
        // 將dd元素內容按照對應索引值來寫入到陣列
    }

    // 9_價格變動函數宣告
    // 點擊dd之後才會呼叫此函數
    // changePriceBind();
    function changePriceBind(arrClickddForShowChangrPrice) {
        // 給每個dd身上設置一自定義屬性來紀錄變化價格
        // 遍歷arrClickddForShow陣列，將dd元素身上的新變化的價格和現有價格5299相加
        // 將計算後的結果重新渲染至p標籤中

        // 元價格元素節點
        var oldPrice = document.querySelector('#wrapper #content .contentMain #center .right .rightTop .priceWrap .priceTop .containerForFlexItem .price p');
        // console.log(oldPrice);

        // 取出預設價格
        var price = goodData.goodDetail.price;

        for (var i = 0; i < arrClickddForShowChangrPrice.length; i++) {
            if (arrClickddForShowChangrPrice[i]) {
                // 經由getAttribute取出的資料為string，需轉換成number，才能運算
                // console.log(arrClickddForShowChangrPrice[i].getAttribute('price'));
                var changeprice = Number(arrClickddForShowChangrPrice[i].getAttribute('price'));

                price += changeprice;
            }
        }

        oldPrice.innerText = price;

        // 與10_chooseprice()連動區代碼開始
        // 將變化後價格寫入到下方chooseprice()所作用範圍中的左側標籤中
        var leftprice = document.querySelector('#wrapper #content .contentMain .goodDetailWrap .rightDetail .chooseBox .listWrap .left p');
        leftprice.innerText = '羊' + price;

        // 遍歷選擇搭配區域中所有複選元素，比對是否有項目選中；如有選中的項目，在基礎價格上加上附加價格
        var iptchkboxes = document.querySelectorAll('#wrapper #content .contentMain .goodDetailWrap .rightDetail .chooseBox .listWrap .middle li input');
        var newprice = document.querySelector('#wrapper #content .contentMain .goodDetailWrap .rightDetail .chooseBox .listWrap .right i');

        for (var j = 0; j < iptchkboxes.length; j++) {
            if (iptchkboxes[j].checked) {
                price += Number(iptchkboxes[j].value)
            }
        }

        // 如沒選中項目，右側套餐價格重新渲染
        newprice.innerText = '羊' + price;

        // 與10_chooseprice()連動區代碼 結束
    }

    // 10_選擇搭配中間區複選框選中套餐價變動效果
    chooseprice();
    function chooseprice() {

        // 先取得中間區所有複選元素
        // 遍歷所有複選元素取得其價格，並與左側基礎價格進行加總，累加之後重新寫回套餐元素節點裡面
        var iptchkboxes = document.querySelectorAll('#wrapper #content .contentMain .goodDetailWrap .rightDetail .chooseBox .listWrap .middle li input');
        // console.log(ckboxes);
        var leftprice = document.querySelector('#wrapper #content .contentMain .goodDetailWrap .rightDetail .chooseBox .listWrap .left p');
        // console.log(leftprice);
        var newprice = document.querySelector('#wrapper #content .contentMain .goodDetailWrap .rightDetail .chooseBox .listWrap .right i');
        // console.log(newprice);


        for (var i = 0; i < iptchkboxes.length; i++) {
            iptchkboxes[i].onclick = function () {
                // 因sliceprice取得是'羊5299'字串，故只擷取索引值1開始到陣列最後一位的純數字部分
                var sliceprice = Number(leftprice.innerText.slice(1));
                for (var j = 0; j < iptchkboxes.length; j++) {
                    if (iptchkboxes[j].checked) {

                        // 運算後價格 = 基礎價格+選中複選框的附加價格(記得補字串轉換成數字)
                        sliceprice = sliceprice + Number(iptchkboxes[j].value);
                    }
                }

                newprice.innerText = '羊' + sliceprice;
            }
        }
    }

    // 11_封裝一個公共選項卡切換內容函數
    // 點擊元素,顯示元素
    function tabForSwitchCont(tabBtns, tabConts) {
        for (var i = 0; i < tabBtns.length; i++) {
            // 新增自訂索引以利後續操作取用，渲染新的對應內容
            tabBtns[i].index = i;
            tabBtns[i].onclick = function () {

                // 沒點擊的標元素與內容元素，清空classname(套用預設樣式)
                for (var j = 0; j < tabBtns.length; j++) {
                    tabBtns[j].className = '';
                    tabConts[j].className = '';
                }
                // 欲處理"當前點擊元素"時，用this
                // 當前被點擊元素的className填入active，這個active樣式表在less已經預寫好
                this.className = 'active';
                //使點擊元素索引值對應相同的顯示元素索引值，使對應到的顯示元素裡的className填入active(把被點元素與被顯示元素這兩者的索引值對應起來)
                tabConts[this.index].className = 'active';
            }
        }
    }

    // 12_點擊選項卡
    leftTab();
    function leftTab() {
        //被點擊元素
        var h4sforclick = document.querySelectorAll('#wrapper #content .contentMain .goodDetailWrap .leftAside .asidTop h4');
        // console.log(h4s);
        // 要切換並顯示的元素
        var divsforshowleft = document.querySelectorAll('#wrapper #content .contentMain .goodDetailWrap .leftAside .asidContent>div');

        tabForSwitchCont(h4sforclick, divsforshowleft);
    }

    rightTab();
    function rightTab() {
        //被點擊元素

        var lisforclick = document.querySelectorAll('#wrapper #content .contentMain .goodDetailWrap .rightDetail .BottomDetail .tabBtns li');
        // 要切換並顯示的元素

        var divsforshowright = document.querySelectorAll('#wrapper #content .contentMain .goodDetailWrap .rightDetail .BottomDetail .tabContents div');

        tabForSwitchCont(lisforclick, divsforshowright);
    }

    //13_右邊側邊欄點擊效果
    rightAsideBind();
    function rightAsideBind() {
        // 先取按鈕元素,綁點擊事件
        // 點擊事件後記錄初始狀態，在事件內部進行判斷，如當前為關閉則進行展開，否則為關閉
        // 取得右側面板元素，
        // 如右側邊欄展開，則設置按鈕與側邊欄對應的class樣式(btnsOpen asideOpen)新增在基礎樣式之上。關閉亦如此

        var btns = document.querySelector('#wrapper .rightAside .btns');
        // console.log(btns);

        // 紀錄面板初始狀態(初設定true代表關閉狀態)
        var flag = true;

        // 取側邊欄元素
        var rightAside = document.querySelector('#wrapper .rightAside');
        // console.log(rightAside);
            btns.onclick = function () {

                if (flag) {
                    // 如果當前為關閉，則從關閉到展開
                    // flag = false;
                    btns.className = 'btns btnsOpen';
                    rightAside.className = 'rightAside asideOpen';

                } else {
                    //如果當前為展開，則從展開到關閉
                    // flag = true;
                    btns.className = 'btns btnsClose';
                    rightAside.className = 'rightAside asideClose';

                }

                //無論前面的if執行到哪段代碼，最終flag狀態都是原基礎上進行取反
                flag = !flag;
            }
    }
}