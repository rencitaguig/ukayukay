$(document).ready(function () {
    var table = $('#announcementTable').DataTable({
        ajax: {
            url: "/api/announcements",
            dataSrc: ""
        },
        dom: 'Bfrtip',
        buttons: [
            'pdf',
            'excel',
            {
                text: 'Add Announcement',
                className: 'btn btn-primary',
                action: function (e, dt, node, config) {
                    $('#announcementForm').trigger('reset');
                    $('#announcementModal').modal('show');
                    $('#announcementUpdate').hide();
                    $('#announcementSubmit').show();
                }
            }
        ],
        columns: [
            { data: 'id', title: 'ID' },
            { data: 'title', title: 'Title' },
            { data: 'date_of_arrival', title: 'Date of Arrival' },
            { data: 'description', title: 'Description' },
            {
                data: 'image',
                title: 'Image',
                render: function (data) {
                    return `<img src="${data}" width="50" height="60" style="margin-right: 5px;">`;
                }
            },
            {
                data: null,
                title: 'Actions',
                render: function (data) {
                    return `<a href='#' class='editBtn' data-id="${data.id}"><i class='fas fa-edit' style='font-size:24px'></i></a>
                            <a href='#' class='deleteBtn' data-id="${data.id}"><i class='fas fa-trash-alt' style='font-size:24px; color:red'></i></a>`;
                }
            }
        ]
    });

    $('#announcementSubmit').on('click', function (e) {
        e.preventDefault();
        var formData = new FormData($('#announcementForm')[0]);
        $.ajax({
            type: 'POST',
            url: '/api/announcements',
            data: formData,
            contentType: false,
            processData: false,
            headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
            success: function (response) {
                $('#announcementModal').modal('hide');
                table.ajax.reload();
            },
            error: function (error) {
                console.log(error);
            }
        });
    });

    $('#announcementUpdate').on('click', function (e) {
        e.preventDefault();
        var id = $('#announcementId').val();
        var formData = new FormData($('#announcementForm')[0]);
        formData.append('_method', 'PUT');
        $.ajax({
            type: 'POST',
            url: `/api/announcements/${id}`,
            data: formData,
            contentType: false,
            processData: false,
            headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
            success: function (response) {
                $('#announcementModal').modal('hide');
                table.ajax.reload();
            },
            error: function (error) {
                console.log(error);
            }
        });
    });

    $('#announcementTable tbody').on('click', 'a.editBtn', function (e) {
        e.preventDefault();
        var id = $(this).data('id');
        $.ajax({
            type: 'GET',
            url: `/api/announcements/${id}`,
            headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
            success: function (data) {
                $('#title').val(data.title);
                $('#date_of_arrival').val(data.date_of_arrival);
                $('#description').val(data.description);
                $('#announcementId').val(id);
                $('#announcementModal').modal('show');
                $('#announcementSubmit').hide();
                $('#announcementUpdate').show();
            },
            error: function (error) {
                console.log(error);
            }
        });
    });

    $('#announcementTable tbody').on('click', 'a.deleteBtn', function (e) {
        e.preventDefault();
        var id = $(this).data('id');
        if (confirm('Are you sure you want to delete this announcement?')) {
            $.ajax({
                type: 'DELETE',
                url: `/api/announcements/${id}`,
                headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
                success: function (response) {
                    table.ajax.reload();
                },
                error: function (error) {
                    console.log(error);
                }
            });
        }
    });
});
