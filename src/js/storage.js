var table_row = function(data){
    var option = updateObject({
        surname:"",
        name:"",
        patronymic:"",
        email:"",
        dateBirth:0,
        id:null,
        gender:"",
        course:""
    }, data);

    if(option.id == null){
        return console.error("Нужен id!!!!");
    }

    return $("<tr class='row-id-"+option.id+"'><td>"+option.surname+"</td><td>"+option.name+"</td><td>"+option.patronymic+"</td><td>"+option.email+"</td><td>"+option.dateBirth+"</td><td>"+option.gender+"</td><td>"+option.course+"</td><td><button class='btn btn-default edit_row_modal' data-id='"+option.id+"'>Edit</button> <button class='btn btn-default remove_row' data-id='"+option.id+"'>Delete</button></td></tr>");
};

var updateObject = function(obj, data){
    for(var key in obj){
        obj[key] = data[key] ? data[key] : obj[key];
    }
    return obj;
};
var cloneObject = function(obj){
    var clone = {};
    for(var key in obj){

        clone[key] = obj[key];
    }
    return clone;
};

var TransferDataToModal= function (objStorage) {
    for (var key in objStorage) {
        if(objStorage.hasOwnProperty(key)) {
            $("#edit-" + key).val(objStorage[key]);
        }

    }

};

var TransferModalToData = function () {
    var modalObj={};
    var editInputs= $(".edit-input");
    var i=0;
    for (i=0;i<editInputs.length;i++ ) {
        var id=$(editInputs[i]).attr("id");
        var prop=id.replace("edit-","");
        modalObj[prop]=$(editInputs[i]).val();
    }
    return modalObj;
};



var OpenModal= function (state) {
    var modal=$('#editModal');
    modal.data("state",state);
    if(state=="add"){
        modal.find("input").val("");
    }
    modal.modal('show');
};

var Validate=function (row_edit) {
    var flagNotAdd = false;
    var empty = false;
    var more15 = false;
    var flagSpaces = true;
    var errorMessage = '';

    if ( row_edit.name.length == 0) {
        empty = true;
    } else {
        var i;
        for (i = 0; i < row_edit.name.length; i++) {
            if ( row_edit.name[i] != ' ')
                flagSpaces = false;
        }
    }
    if (row_edit.name.length > 15) {
        more15 = true;
    }
    if (empty)
        errorMessage += "Поле Name не может быть пустым ";
    if (flagSpaces && row_edit.name.length > 0)
        errorMessage += "Поле Name не может состоять только из пробелов ";
    if (more15)
        errorMessage += "Максимальная длина 15 букв поля Name ";


    return errorMessage;
};

//Хранилище данных Start
function Storage(){
    this.$table = $(".main-tbody");
    this.table = [];
    var currentId;
    this.maxId=1;
}

Storage.prototype.SaveModal=function () {
    var errorMessage = '';

    var row_edit = TransferModalToData();

    errorMessage=Validate(row_edit);

    $('#errorsEdit').text(errorMessage);

    if (errorMessage == '') {
        var modal=$('#editModal');
        var state=modal.data("state");
        if(state=="edit") {
            this.edit(row_edit, this.currentId);
        }
        if(state=="add") {
            this.add(row_edit);
        }
        modal.find("input").val("");
        modal.modal('hide');
        this.print();
    }
};


Storage.prototype.removeById = function(id){
    var indexId = false;
    this.table.forEach(function(row, index){
        if(row.id == id) {
            indexId = index;
            return false;
        }
    });
    if(indexId !== false){
        this.table.splice(indexId, 1);
    }
};
Storage.prototype.getById =function(id){
    var itemIndx =false;
    this.table.forEach(function(row,index){
        if(row.id==id){
            itemIndx=index;
            return false;
        }
    });
    if(itemIndx!==false){
        return this.table[itemIndx];
    }
};

Storage.prototype.add = function(data){
    if(this.table.length==0&&data.id) {
        this.maxId = data.id;


    }else {
        this.maxId=this.table[this.table.length - 1].id;
        this.maxId++;
        data.id = this.maxId;
    }
    this.table.push(data);


};

Storage.prototype.edit=function(newItem,idInTable){
    var indx =false;
    this.table.forEach(function(row,index){
        if(row.id==idInTable){
            indx=index;
            return false;
        }
    });
    this.table[indx].name=newItem.name;
    this.table[indx].surname=newItem.surname;
    this.table[indx].patronymic=newItem.patronymic;
    this.table[indx].course=newItem.course;
    this.table[indx].dateBirth=newItem.dateBirth;
    this.table[indx].email=newItem.email;
    this.table[indx].gender=newItem.gender;


};
Storage.prototype.editCurrentId=function(id){
    if(id>0){
        this.currentId=id;
    }
    };


//--------------сортировка по имени---------

Storage.prototype.ascendingSort=function(el){
    this.table.sort(function(obj1, obj2) {
        // Сортировка по возрастанию
        if(obj1[el].toLowerCase()>obj2[el].toLowerCase())
            return 1;
        else if(obj1[el].toLowerCase()<obj2[el].toLowerCase())
            return -1;
        else return 0;

    });
};
Storage.prototype.descendingSort=function(el){
    this.table.sort(function(obj1, obj2) {
        // Сортировка по убыванию
        if(obj1[el].toLowerCase()<obj2[el].toLowerCase())
            return 1;
        else if(obj1[el].toLowerCase()>obj2[el].toLowerCase())
            return -1;
        else return 0;
    });

};
//------------------------------------------
Storage.prototype.print = function(searchText) {
    var self = this;
    this.$table.empty();
    if(searchText) {
        searchText = searchText.toLowerCase();
        this.table.forEach(function (data) {
            var testStr = data.surname;
            var resultStr = "";
            var valid = false;

            var endIndex = 0;
            var startIndex = 0;
            while(testStr.toLowerCase().indexOf(searchText)>=0){
                startIndex = testStr.toLowerCase().indexOf(searchText);
                resultStr+=testStr.substr(0,startIndex);
                resultStr+="<b>"+testStr.substr(startIndex, searchText.length)+"</b>";
                endIndex = startIndex+searchText.length;
                testStr = testStr.substr(endIndex, data.surname.length);
                valid = true;
            }
            if(valid){
                resultStr += testStr;
                var newData = cloneObject(data);
                newData.surname = resultStr;
                self.$table.append(table_row(newData));
            }
        });
    } else {
        this.table.forEach(function (data) {
            self.$table.append(table_row(data));
        });
    }
};
//Хранилище данных End