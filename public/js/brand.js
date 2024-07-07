$(document).ready(function () {
    var table = $('#brandtable').DataTable({
        ajax: {
            url: "/api/brands",
            dataSrc: ""
        },
        dom: 'Bfrtip',
        buttons: [
            'pdf',
            'excel',
            {
                text: 'Add Brand',
                className: 'btn btn-primary',
                action: function (e, dt, node, config) {
                    $("#brandform").trigger("reset");
                    $('#brandModal').modal('show');
                    $('#brandUpdate').hide();
                    $('#brandSubmit').show();
                    $('#brandImages').remove();
                }
            }
        ],
        columns: [
            { data: 'id', title: 'ID' },
            { data: 'name', title: 'name' },
            { data: 'company', title: 'company' },
            { data: 'website', title: 'website' },
            { data: 'description', title: 'description' },
            { data: 'status', title: 'status' },
            {
                data: 'logo',
                title: 'Image',
                render: function (data, type, row) {
                    var imgPaths = data.split(',');
                    var imagesHTML = '';
                    imgPaths.forEach(function (path) {
                        if (path.endsWith('.jpg') || path.endsWith('.jpeg') || path.endsWith('.png')) {
                            imagesHTML += `<img src="${path}" width="50" height="60" style="margin-right: 5px;">`;
                        }
                    });
                    return imagesHTML;
                }
            },
            {
                data: null,
                title: 'Actions',
                render: function (data, type, row) {
                    return `<a href='#' class='editBtn' data-id="${data.id}"><i class='fas fa-edit' style='font-size:24px'></i></a>
                            <a href='#' class='deleteBtn' data-id="${data.id}"><i class='fas fa-trash-alt' style='font-size:24px; color:red'></i></a>`;
                }
            }
        ],
    });

    $("#brandSubmit").on('click', function (e) {
        e.preventDefault();
        var data = $('#brandform')[0];
        let formData = new FormData(data);
        $.ajax({
            type: "POST",
            url: "/api/brands",
            data: formData,
            contentType: false,
            processData: false,
            headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
            dataType: "json",
            success: function (data) {
                $("#brandModal").modal("hide");
                table.ajax.reload();
            },
            error: function (error) {
                console.log(error);
            }
        });
    });

    $('#brandtable tbody').on('click', 'a.editBtn', function (e) {
        e.preventDefault();
        $('#brandImages').remove();
        $('#brandId').remove();
        $("#brandform").trigger("reset");

        var id = $(this).data('id');
        $('<input>').attr({ type: 'hidden', id: 'brandId', name: 'id', value: id }).appendTo('#brandform');
        $('#brandModal').modal('show');
        $('#brandSubmit').hide();
        $('#brandUpdate').show();

        $.ajax({
            type: "GET",
            url: `/api/brands/${id}`,
            headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
            dataType: "json",
            success: function (data) {
                $('#name_id').val(data.name);
                $('#company_id').val(data.company);
                $('#website_id').val(data.website);
                $('#description_id').val(data.description);
                $('#status_id').val(data.status);

                var imagesHTML = '';
                data.logo.split(',').forEach(function (path) {
                    if (path.endsWith('.jpg') || path.endsWith('.jpeg') || path.endsWith('.png')) {
                        imagesHTML += `<img src="${path}" width='200px' height='200px'>`;
                    }
                });
                $("#brandform").append("<div id='brandImages'>" + imagesHTML + "</div>");
            },
            error: function (error) {
                console.log(error);
            }
        });
    });

    $("#brandUpdate").on('click', function (e) {
        e.preventDefault();
        var id = $('#brandId').val();
        var data = $('#brandform')[0];
        let formData = new FormData(data);
        formData.append("_method", "PUT");
        $.ajax({
            type: "POST",
            url: `/api/brands/${id}`,
            data: formData,
            contentType: false,
            processData: false,
            headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
            dataType: "json",
            success: function (data) {
                $('#brandModal').modal("hide");
                table.ajax.reload();
            },
            error: function (error) {
                console.log(error);
            }
        });
    });

    $('#brandtable tbody').on('click', 'a.deleteBtn', function (e) {
        e.preventDefault();
        var id = $(this).data('id');
        var $row = $(this).closest('tr');
        bootbox.confirm({
            message: "Do you want to delete this brand?",
            buttons: {
                confirm: {
                    label: 'Yes',
                    className: 'btn-success'
                },
                cancel: {
                    label: 'No',
                    className: 'btn-danger'
                }
            },
            callback: function (result) {
                if (result) {
                    $.ajax({
                        type: "DELETE",
                        url: `/api/brands/${id}`,
                        headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
                        dataType: "json",
                        success: function (data) {
                            table.row($row).remove().draw();
                        },
                        error: function (error) {
                            console.log(error);
                        }
                    });
                }
            }
        });
    });
});
