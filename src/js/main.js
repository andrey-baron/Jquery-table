$(function(){
    var storage = new Storage();
    window.tableData.forEach(function(data){
        storage.add(data);
    });

    $( "#slider" ).slider({
        min:1,
        max:6,
        change: function( event, ui ) {

            $( "#edit-course" ).spinner( "value", ui.value );
        }
    });
    var spinner = $( "#edit-course" ).spinner({
        min:1,
        max:6,
        create: function( event, ui ) {
            ui.value=1;
            $( "#edit-course" ).spinner( "value", 1 );
        }
    });
    var autocomplete=[];

    function setAutocomplete(el, index, array) {
        autocomplete.push(el.surname);
    }
    storage.table.forEach(setAutocomplete);
    $( ".search_input" ).autocomplete({
        source: autocomplete,
        select: function( event, ui ) {
            var searchText = ui.item.value;
            storage.print(searchText);
        }
    });

    $('.search_input').on('input', function(){
        var searchText = $(this).val().trim();
        storage.print(searchText);
    });



    $(document).on('click','.remove_row', function() {
        $('#delete-confirm').modal('show');
        storage.editCurrentId($(this).data('id'));
        var curObj=storage.getById(storage.currentId);
        if(curObj!='undefined') {
            $("#deleteModalLabel").text("Вы действительно хотите удалить студента "+curObj.surname+" "+curObj.name);
        }
    });


    $(document).on('click', '.del-row-btn', function(){
        $('#delete-confirm').modal('show');

        storage.removeById(storage.currentId);
        $("#deleteModalLabel").text("");
        $('#delete-confirm').modal('hide');
        storage.print();
    });

    $(document).on('click','.edit_row_modal',function(){
        storage.editCurrentId($(this).data('id'));
        var cloneCurrentRow= storage.getById(storage.currentId);

        TransferDataToModal(cloneCurrentRow);

        OpenModal("edit");


    });
    //---------------------------------------------
    $(document).on('click','.edit-row-btn',function(){
        storage.SaveModal();
    });
//----------------------------------------------

     $(document).on('click', '.add-row-modal', function(){
         OpenModal("add");
     });


   /* $(document).on('click','#triangleName',function(){
        var triangle=document.getElementById('triangleName');

        if(triangle.className=='triangle-up'){
            storage.descendingNameSort();
            triangle.className='triangle-down';
        }else {
            triangle.className = 'triangle-up';
            storage.ascendingNameSort();
        }
        storage.print();

    });*/
    $(document).on('click','.table tr>th',function(){
        var triangle=$(this).find('.triangle');
        var typeField=$(this).data("typefield");
        if(typeField!='undefined') {
            if ($(this).data("sort") == "true") {
                storage.descendingSort(typeField);
                triangle.removeClass("triangle-up");
                triangle.addClass("triangle-down");
                $(this).data("sort", "false")
            } else {
                storage.ascendingSort(typeField);
                triangle.removeClass("triangle-down");
                triangle.addClass("triangle-up");
                $(this).data("sort", "true")
            }
            storage.print();
        }
    });

    storage.print();
});