(function() {
    'use strict';
    angular.module('app').factory("ContactsFactory",
        function($cordovaContacts, $q) {
            var self = {
                findContact: function(firstName, lastName) {
                    var deferred = $q.defer();
                    var opts = {
                        filter: firstName + " " + lastName,
                        fields: ['displayName']
                    };
                    $cordovaContacts.find(opts).then(function(contactsFound) {
                        deferred.resolve(contactsFound);
                    });
                    return deferred.promise;
                },
                createContact: function(presenter) {
                    var deferred = $q.defer();
                    var name = new ContactName();
                    name.givenName = presenter.firstname;
                    name.familyName = presenter.lastname;
                    var organizations = [];
                    var organization = new ContactOrganization();
                    organization.name = presenter.company;
                    organizations.push(organization);
                    var urls = [];
                    for (var i in presenter.socials) {
                        var link = presenter.socials[i];
                        urls.push(new ContactField(link.class, link.link));
                    }
                    var contact = {
                        "displayName": presenter.firstname + " " + presenter.lastname,
                        "nickname": presenter.id,
                        "name": name,
                        "organizations": organizations,
                        "note": presenter.about,
                        "urls": urls
                    };
                    $cordovaContacts.save(contact).then(function(res) {
                        deferred.resolve(res);
                    }, function(err) {
                        deferred.reject(err);
                    })
                    return deferred.promise;
                }
            };
            return self;
        }
    );
})();
