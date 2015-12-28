(function () {
    define([], function () {
        var consomationController = function (project) {
            var vm = this;
            vm.entries = [
                {
                    name: "admin",
                    consommations: [{date: "20/12", value: 1},
                        {date: "20/12", value: 1},
                        {date: "20/12", value: 1},
                        {date: "20/12", value: 1},
                        {date: "20/12", value: 1}],
                    details: [
                        {name: "task 1",
                            consommations: [{date: "20/12", value: 1},
                                {date: "20/12", value: 1},
                                {date: "20/12", value: 1},
                                {date: "20/12", value: 1},
                                {date: "20/12", value: 1}]
                        }]
                },
                {
                    name: "user2",
                    consommations: [{date: "20/12", value: 1},
                        {date: "20/12", value: 1},
                        {date: "20/12", value: 1},
                        {date: "20/12", value: 1},
                        {date: "20/12", value: 1}],
                    details: [
                        {name: "task 3",
                            consommations: [{date: "20/12", value: 1},
                                {date: "20/12", value: 1},
                                {date: "20/12", value: 0},
                                {date: "20/12", value: 0},
                                {date: "20/12", value: 1}]
                        },
                        {name: "task 4",
                            consommations: [{date: "20/12", value: 0},
                                {date: "20/12", value: 0},
                                {date: "20/12", value: 1},
                                {date: "20/12", value: 1},
                                {date: "20/12", value: 0}]
                        }
                    ]
                }];
        };
        consomationController.$inject = ["project"];
        return consomationController;
    });
})();