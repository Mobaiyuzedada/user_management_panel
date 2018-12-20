; (function () {
    'use strict';

    let userlist = [];
    let elForm = document.querySelector('#form-add-user');
    let elTable = document.getElementById('user-table');
    let users;
    let tbody = elTable.querySelector('tbody');
    let $list;
    let currentId;
    let inputs=elForm.querySelectorAll('input');


    boot();

    function boot() {
        read();
        bindSubmit();
    }



    /*
    |----------------------------------------------------------
    | 存数据，从Form中取得数据，然后存到数据库中，最后渲染到table里
    |----------------------------------------------------------
    | description
    */
    /**
     * 绑定事件，提交时获取输入框中的值,添加到数据库
     */
    function bindSubmit() {
        elForm.addEventListener('submit', $ => {
            $.preventDefault();

            let data = {};
            data.username = elForm.querySelector('[name=username]').value;
            data.email = elForm.querySelector('[name=email').value;
            data.phone = elForm.querySelector('[name=phone]').value;
            data.balance = elForm.querySelector('[name=balance]').value;
            if (currentId)
                update(currentId, data);
            else
                create(data);

        });
    }
    /**
     * 将数据添加到数据库,如果成功，清空form
     * @param  data:要添加到数据库的数据
     */
    function create(data) {
        api('user/create', data, res => {
            if (res.success) {
                read();
                elForm.reset();
            }
        })
    }




    function update(id,row) {
        api('user/update',{id,...row},res=>{
            read();
            elForm.reset();
        })
    }





    /**
     * 从数据库中读取数据，并渲染到table中
     */
    function read() {
        api('user/read', null, res => {
            $list = res.data;
            console.log($list );
            render($list);
            // console.log($list);
        });
    }
    function render($list) {
        tbody.innerHTML = '';
        $list && $list.forEach(it => {
            let tr = document.createElement('tr');
            tr.innerHTML = `
            <td>${it.username}</td>
            <td>${it.email}</td>
            <td>${it.phone}</td>
            <td>${it.balance}</td>
            <td class="opera"><button class="my-btn update">更新</button><button class="my-btn del">删除</button></td>
            `
            tbody.appendChild(tr);

            let opts = tr.querySelector('.opera');
            opts.addEventListener('click', e => {
                let et = e.target;
                if (et.classList.contains('del'))
                    del(it.id);
                if (et.classList.contains('update')){
                    currentId=it.id;
                    inputs.forEach(item=>{
                        item.value=it[item.name];
                    })
                }
                    

            })
            // let delBtn = tr.querySelector('.del');
            // console.log(delBtn);
            // delBtn.addEventListener('click', () => {
            //     console.log('执行了');
            //     del(it.id);
            // });
        });
    }
    function del(id) {
        api('user/delete', { id }, r => {
            read();
        });
    }


})();