define([
    "jquery",
    "underscore"
], function($, _) {

    var buttonPublish = {
        extensionId: "buttonPublish",
        extensionName: 'Button "Publish"',
        settingsBloc: '<p>Adds a "Publish document" button in the navigation bar.</p>'
    };

    var button = undefined;
    var currentFileDesc = undefined;
    var publishRunning = false;
    var hasPublications = false;
    var isOffline = false;
    // Enable/disable the button
    function updateButtonState() {
        if(button === undefined) {
            return;
        }
        if(publishRunning === true || hasPublications === false || isOffline === true) {
            button.addClass("disabled");
        }
        else {
            button.removeClass("disabled");
        }
    }
    ;

    var publisher = undefined;
    buttonPublish.onPublisherCreated = function(publisherParameter) {
        publisher = publisherParameter;
    };

    buttonPublish.onCreateButton = function() {
        button = $([
            '<button class="btn" title="Publish this document">',
            '   <i class="icon-share"></i>',
            '</button>'
        ].join("")).click(function() {
            if(!$(this).hasClass("disabled")) {
                publisher.publish();
            }
        });
        return button;
    };

    buttonPublish.onPublishRunning = function(isRunning) {
        publishRunning = isRunning;
        updateButtonState();
    };

    buttonPublish.onOfflineChanged = function(isOfflineParameter) {
        isOffline = isOfflineParameter;
        updateButtonState();
    };

    // Check that current file has publications
    var checkPublication = function() {
        if(_.size(currentFileDesc.publishLocations) === 0) {
            hasPublications = false;
        }
        else {
            hasPublications = true;
        }
        updateButtonState();
    };

    buttonPublish.onFileSelected = function(fileDesc) {
        currentFileDesc = fileDesc;
        checkPublication();
    };

    buttonPublish.onPublishRemoved = checkPublication;
    buttonPublish.onNewPublishSuccess = checkPublication;

    return buttonPublish;

});