/// <reference path="angular.min.js" />

var app = angular.module('mainModule', ["ngRoute", "ui.bootstrap", "ngSanitize", "ngAnimate"])
    .config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider
                .when("/products", {
                    templateUrl: '/Content/Templates/Products.html',
                    controller: 'productsController'
                })
                .when("/addPlans", {
                    templateUrl: '/Content/Templates/AddPlans.html',
                    controller: 'addPlanController'
                })
                .when("/sales", {
                    templateUrl: '/Content/Templates/Sales.html',
                    controller: 'salesController'
                })
        }])
    .controller('createProductController', function ($uibModalInstance, $scope, $http, availableGroups) {
        $scope.message = 'Создание товара';
        $scope.product = { title: null, groupId: null, groupTitle: null };
        $scope.availableGroups = availableGroups;

        $scope.ok = function () {
            if (!$scope.product || !$scope.product.title || !$scope.group) {
                alert('Заполните все поля');
                return;
            }
            var productToCreate = { title: $scope.product.title, groupId: $scope.group.id };

            $http({
                method: 'post',
                url: 'products/create',
                data: productToCreate
            }).
                then(function (response) {
                    if (response.data) {
                        var createdProduct = { id: response.data, title: $scope.product.title, group: $scope.group.title, groupId: $scope.group.id };
                        $uibModalInstance.close(createdProduct);
                    }
                });

        };
        $scope.cancel = function () {
            $uibModalInstance.close();
        };
    })
    .controller('editProductController', function ($uibModalInstance, $scope, $http, product, availableGroups) {
        $scope.message = 'Редактирование товара';
        $scope.product = product;
        $scope.availableGroups = availableGroups;
        $scope.group = $scope.availableGroups.find(group => group.id == product.groupId);

        $scope.ok = function () {
            if (!$scope.product || !$scope.product.title || !$scope.group) {
                alert('Заполните все поля');
                return;
            }
            var productToEdit = { id: $scope.product.id, title: $scope.product.title, groupId: $scope.group.id };

            $http({
                method: 'put',
                url: 'products/edit',
                data: productToEdit
            }).
                then(function (response) {
                    if (response) {
                        var editedProduct = { id: $scope.product.id, title: $scope.product.title, group: $scope.group.title, groupId: $scope.group.id };
                        $uibModalInstance.close(editedProduct);
                    }
                });
        };
        $scope.cancel = function () {
            $uibModalInstance.close();
        };
    })
    .controller('deleteProductController', function ($uibModalInstance, $scope, $http, product) {
        $scope.message = 'Вы точно хотите удалить товар' + ' ' + product.title + '?';
        $scope.product = product;
        $scope.ok = function () {
            var productIdToDelete = { id: $scope.product.id };
            $http({
                method: 'post',
                url: 'products/delete',
                params: productIdToDelete
            }).
                then(function (response) {
                    if (response) {
                        var deletedProductId = $scope.product.id;
                        $uibModalInstance.close(deletedProductId);
                    }
                });
        };
        $scope.cancel = function () {
            $uibModalInstance.close();
        };
    })
    .controller('createSaleController', function ($uibModalInstance, $scope, $http, availableClients, availableProducts) {
        $scope.message = 'Создание продажи';
        $scope.clientId = availableClients[0].id;
        $scope.date = new Date();
        $scope.availableClients = availableClients;
        $scope.availableProducts = availableProducts;
        $scope.productsInSale = [];

        $scope.selectedProductInSale = null;

        $scope.addProduct = function () {
            var productToAdd = { id: $scope.availableProducts[0].id, rowId: $scope.productsInSale.length + 1, count: 1, price: 0 };
            $scope.productsInSale.push(productToAdd);
        }

        $scope.deleteProduct = function () {
            if ($scope.selectedProductInSale) {
                var deletedProductId = $scope.selectedProductInSale.rowId;
                var product = $scope.productsInSale.find(product => product.rowId === deletedProductId);
                var indexOfDeletedProduct = $scope.productsInSale.indexOf(product);
                if (indexOfDeletedProduct > -1) {
                    $scope.productsInSale.splice(indexOfDeletedProduct, 1);
                    $scope.selectedProductInSale = null;
                }
            }
        }

        $scope.productSaleSelected = function (productInSale) {
            $scope.selectedProductInSale = productInSale;
        }

        $scope.totalSum = function () {
            var total = 0;

            for (var i = 0; i < $scope.productsInSale.length; i++) {
                var productAmount = $scope.productsInSale[i].count * $scope.productsInSale[i].price;
                total += isNaN(productAmount) ? 0 : productAmount;
            }
            return total;
        }

        $scope.ok = function () {
            var productsToPost = $scope.getProductsToPost();

            if (productsToPost.length < 1 || $scope.clientId < 1 || $scope.date == null) {
                alert('Неверные данные');
                return;
            }

            var saleToCreate = { ClientId: $scope.clientId, Date: $scope.date, Products: productsToPost };

            $http({
                method: 'post',
                url: 'sales/create',
                data: saleToCreate
            }).
                then(function (response) {
                    if (response) {
                        alert('Продажа создана');
                        $uibModalInstance.close();
                    }
                }, function (response) {
                    alert(response.data);
                });
        };

        $scope.getProductsToPost = function () {
            var result = [];

            for (var i = 0; i < $scope.productsInSale.length; i++) {
                if ($scope.productsInSale[i].count > 0 && $scope.productsInSale[i].price > 0) {
                    result.push($scope.productsInSale[i]);
                }
            }
            return result;

        }

        $scope.cancel = function () {
            $uibModalInstance.close();
        };
    })
    .controller('editSaleController', function ($uibModalInstance, $scope, $http, availableClients, availableProducts, sale) {
        $scope.message = 'Создание продажи';
        $scope.saleId = sale.id;
        $scope.clientId = sale.clientId;
        var date = new Date(sale.saleDate);
        var utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        $scope.date = utcDate;
        $scope.availableClients = availableClients;
        $scope.availableProducts = availableProducts;
        $scope.productsInSale = [];

        $scope.selectedProductInSale = null;

        $http({
            method: 'get',
            url: 'sales/GetSaleProducts?saleId=' + $scope.saleId
        }).
            then(function (response) {
                if (response.data) {
                    for (var i = 0; i < response.data.length; i++) {
                        $scope.addProduct(response.data[i]);
                    }
                }
            });

        $scope.addProduct = function (productToAdd) {
            if (productToAdd) {
                productToAdd = { id: productToAdd.productId, rowId: $scope.productsInSale.length + 1, count: productToAdd.prodCount, price: productToAdd.prodPrice };
            } else {
                productToAdd = { id: $scope.availableProducts[0].id, rowId: $scope.productsInSale.length + 1, count: 1, price: 0 };
            }
            $scope.productsInSale.push(productToAdd);
        }

        $scope.deleteProduct = function () {
            if ($scope.selectedProductInSale) {
                var deletedProductId = $scope.selectedProductInSale.rowId;
                var product = $scope.productsInSale.find(product => product.rowId === deletedProductId);
                var indexOfDeletedProduct = $scope.productsInSale.indexOf(product);
                if (indexOfDeletedProduct > -1) {
                    $scope.productsInSale.splice(indexOfDeletedProduct, 1);
                    $scope.selectedProductInSale = null;
                }
            }
        }

        $scope.productSaleSelected = function (productInSale) {
            $scope.selectedProductInSale = productInSale;
        }

        $scope.totalSum = function () {
            var total = 0;

            for (var i = 0; i < $scope.productsInSale.length; i++) {
                var productAmount = $scope.productsInSale[i].count * $scope.productsInSale[i].price;
                total += isNaN(productAmount) ? 0 : productAmount;
            }
            return total;
        }

        $scope.ok = function () {
            var productsToPost = $scope.getProductsToPost();

            if (productsToPost.length < 1 || $scope.clientId < 1 || $scope.date == null) {
                alert('Неверные данные');
                return;
            }

            var saleToEdit = { Id: $scope.saleId, ClientId: $scope.clientId, Date: $scope.date, Products: productsToPost };

            $http({
                method: 'post',
                url: 'sales/edit',
                data: saleToEdit
            }).
                then(function (response) {
                    if (response) {
                        alert('Продажа редактирована');
                        $uibModalInstance.close();
                    }
                }, function (response) {
                    alert(response.data);
                });

        };

        $scope.getProductsToPost = function () {
            var result = [];
            for (var i = 0; i < $scope.productsInSale.length; i++) {
                if ($scope.productsInSale[i].count > 0 && $scope.productsInSale[i].price > 0) {
                    result.push($scope.productsInSale[i]);
                }
            }
            return result;
        }

        $scope.cancel = function () {
            $uibModalInstance.close();
        };
    })
    .controller('deleteSaleController', function ($uibModalInstance, $scope, $http, sale) {
        $scope.message = 'Вы точно хотите удалить продажу с Id:' + ' ' + sale.id + '?';
        $scope.sale = sale;
        $scope.ok = function () {
            var saleIdToDelete = { id: $scope.sale.id };
            $http({
                method: 'post',
                url: 'sales/delete',
                params: saleIdToDelete
            }).
                then(function (response) {
                    if (response) {
                        var deletedSaleId = $scope.sale.id;
                        $uibModalInstance.close(deletedSaleId);
                    }
                });
        };
        $scope.cancel = function () {
            $uibModalInstance.close();
        };
    })
    .controller('productsController', function ($scope, $http, $uibModal) {
        $http({ method: 'get', url: 'products/GetGroups' }).
            then(function (response) {
                if (response.data) {
                    $scope.availableGroups = response.data;
                }
            });

        $scope.openNewProductWindow = function () {
            var modalInstance = $uibModal.open({
                templateUrl: 'CreateEditProduct.html',
                controller: 'createProductController',
                resolve: {
                    availableGroups: function () {
                        return $scope.availableGroups;
                    }
                }
            });
            modalInstance.result.then(function (createdProduct) {
                if (createdProduct) {
                    $scope.products.push(createdProduct);
                    $scope.totalProductsInDb++;
                }
            });
        };

        $scope.openEditProductWindow = function () {
            if (!$scope.selectedProduct) {
                alert('Выберите товар');
                return;
            }
            var modalInstance = $uibModal.open({
                templateUrl: 'CreateEditProduct.html',
                controller: 'editProductController',
                resolve: {
                    product: function () {
                        return $scope.selectedProduct;
                    },
                    availableGroups: function () {
                        return $scope.availableGroups;
                    }
                }
            });
            modalInstance.result.then(function (editedProduct) {
                if (editedProduct) {
                    var product = $scope.products.find(product => product.id === editedProduct.id);
                    product.title = editedProduct.title;
                    product.group = editedProduct.group;
                    product.groupId = editedProduct.groupId;
                }
            });
        };

        $scope.openDeleteProductWindow = function () {
            if (!$scope.selectedProduct) {
                alert('Выберите товар');
                return;
            }
            var modalInstance = $uibModal.open({
                templateUrl: 'DeleteProduct.html',
                controller: 'deleteProductController',
                resolve: {
                    product: function () {
                        return $scope.selectedProduct;
                    }
                }
            });
            modalInstance.result.then(function (deletedProductId) {
                if (deletedProductId) {
                    var product = $scope.products.find(product => product.id === deletedProductId);
                    var indexOfDeletedProduct = $scope.products.indexOf(product);
                    if (indexOfDeletedProduct > -1) {
                        $scope.products.splice(indexOfDeletedProduct, 1);
                        $scope.selectedProduct = null;
                        $scope.totalProductsInDb--;
                    }
                }
            });
        }

        $scope.totalProductsInDb = null;

        $scope.currentPage = 0;

        $scope.pageSize = 5;

        $scope.products = [];

        $scope.productSelected = function (product) {
            $scope.selectedProduct = product;
        }

        $scope.updateGroup = function () {
            if (!$scope.selectedGroup) {
                $scope.selectedGroup = undefined;
            }
        };

        $scope.loadMoreData = function () {
            if ($scope.totalProductsInDb != null && $scope.products.length >= $scope.totalProductsInDb) {
                alert('Данных больше нет');
                return;
            }

            $http({
                method: 'get',
                url: 'products/Get?pageNumber=' + ++$scope.currentPage + '&pageSize=' + $scope.pageSize
            }).
                then(function (response) {
                    if (response.data) {
                        response.data.items.forEach(function (product) {
                            var productInList = $scope.products.find(p => p.id === product.id);
                            if (productInList) {
                                productInList.title = product.title;
                                productInList.group = product.group;
                                productInList.groupId = product.groupId;
                            } else {
                                $scope.products.push(product);
                            }
                        });
                        $scope.totalProductsInDb = response.data.totalRecordCount;
                        $scope.currentPage = response.data.pageNumber;
                    }
                });
        };
    })
    .controller('addPlanController', function ($scope, $http) {
        $scope.planCells = [];

        $http({ method: 'get', url: 'plan/GetPlans' }).
            then(function (response) {
                $scope.plansFromDb = response.data;
                $http({ method: 'get', url: 'products/GetGroups' }).
                    then(function (response) {
                        if (response.data) {
                            $scope.groups = response.data;
                            $http({ method: 'get', url: 'plan/GetPeriods' }).
                                then(function (response) {
                                    if (response.data) {
                                        $scope.periods = response.data;
                                        $scope.initTableCells();
                                        $scope.initYearPeriods();
                                    }
                                });
                        }
                    });

            });


        $scope.initTableCells = function () {
            for (var i = 0; i < $scope.groups.length; i++) {
                $scope.planCells[i] = [];
                $scope.planCells[i].group = $scope.groups[i];
                $scope.planCells[i].cells = [];
                for (var j = 0; j < $scope.periods.length; j++) {
                    var cellAmountFromDb = $scope.getCellAmountFromDb($scope.groups[i].id, $scope.periods[j].id);
                    amountToPutInCell = cellAmountFromDb ? cellAmountFromDb : null;
                    var cell = { initialAmount: amountToPutInCell, amount: amountToPutInCell, periodId: $scope.periods[j].id, planYear: $scope.periods[j].planYear };
                    $scope.planCells[i].cells.push(cell);
                }
            }
        }

        $scope.getCellAmountFromDb = function (groupId, periodId) {
            for (var i = 0; i < $scope.plansFromDb.length; i++) {
                if ($scope.plansFromDb[i].prodGroupId == groupId && $scope.plansFromDb[i].periodId == periodId) {
                    return $scope.plansFromDb[i].planAmount;
                }
            }
            return null;
        }

        $scope.initYearPeriods = function () {
            $scope.yearPeriods = [];
            var periodsGroupedByYear = $scope.groupBy($scope.periods, 'planYear');
            for (var key in periodsGroupedByYear) {
                $scope.yearPeriods.push(parseInt(key));
            }
            $scope.selectedYear = $scope.periods[0].planYear;
        }

        $scope.groupBy = function (xs, key) {
            return xs.reduce(function (rv, x) {
                (rv[x[key]] = rv[x[key]] || []).push(x);
                return rv;
            }, {});
        };

        $scope.uploadPlans = function () {
            var postData = [];
            //getting postData. only cells where amount is number and > 0 and amount is changed
            for (var i = 0; i < $scope.planCells.length; i++) {
                for (var j = 0; j < $scope.planCells[i].cells.length; j++) {
                    var amountInCell = $scope.planCells[i].cells[j].amount;
                    var isAmountInCellChanged = $scope.planCells[i].cells[j].amount != $scope.planCells[i].cells[j].initialAmount;
                    if (amountInCell && !isNaN(amountInCell) && amountInCell > 0 && isAmountInCellChanged) {
                        var cell = { amount: amountInCell, groupId: $scope.planCells[i].group.id, periodId: $scope.periods[j].id };
                        postData.push(cell);
                    }
                }
            }
            if (postData.length > 0) {
                $http({
                    method: 'post',
                    url: 'Plan/UploadPlanSales',
                    data: postData
                }).
                    then(function (response) {
                        if (response.data) {
                            var createdProduct = { id: response.data, title: $scope.product.title, group: $scope.group.title, groupId: $scope.group.id };
                            $uibModalInstance.close(createdProduct);
                        }
                    });
            }
        }

        $scope.clearCells = function () {
            for (var i = 0; i < $scope.planCells.length; i++) {
                for (var j = 0; j < $scope.planCells[i].cells.length; j++) {
                    $scope.planCells[i].cells[j].amount = null;
                }
            }
        }
    })
    .controller('salesController', function ($scope, $http, $uibModal) {
        $http({
            method: 'get',
            url: 'products/GetAll'
        }).
            then(function (response) {
                if (response.data) {
                    $scope.availableProducts = response.data;
                }
            });

        $http({ method: 'get', url: 'sales/GetClients' }).
            then(function (response) {
                if (response.data) {
                    $scope.availableClients = response.data;
                }
            });

        $scope.openNewSaleWindow = function () {
            var modalInstance = $uibModal.open({
                templateUrl: 'CreateEditSale.html',
                controller: 'createSaleController',
                resolve: {
                    availableClients: function () {
                        return $scope.availableClients;
                    },
                    availableProducts: function () {
                        return $scope.availableProducts;
                    }
                }
            });
            modalInstance.result.then(function () {
                $scope.goToPage(1);
            });
        };

        $scope.openEditSaleWindow = function () {
            if (!$scope.selectedSale) {
                alert('Выберите продажу');
                return;
            }
            var modalInstance = $uibModal.open({
                templateUrl: 'CreateEditSale.html',
                controller: 'editSaleController',
                resolve: {
                    availableClients: function () {
                        return $scope.availableClients;
                    },
                    availableProducts: function () {
                        return $scope.availableProducts;
                    },
                    sale: function () {
                        return $scope.selectedSale;
                    }
                }
            });
            modalInstance.result.then(function () {
                $scope.goToPage($scope.currentPage);
            });
        };

        $scope.openDeleteSaleWindow = function () {
            if (!$scope.selectedSale) {
                alert('Выберите продажу');
                return;
            }
            var modalInstance = $uibModal.open({
                templateUrl: 'DeleteSale.html',
                controller: 'deleteSaleController',
                resolve: {
                    sale: function () {
                        return $scope.selectedSale;
                    }
                }
            });
            modalInstance.result.then(function (deletedSaleId) {
                if (deletedSaleId) {
                    var sale = $scope.sales.find(sale => sale.id === deletedSaleId);
                    var indexOfDeletedProduct = $scope.sales.indexOf(sale);
                    if (indexOfDeletedProduct > -1) {
                        $scope.sales.splice(indexOfDeletedProduct, 1);
                        $scope.selectedSale = null;
                    }
                    $scope.goToPage(1);
                }
            });
        }

        $scope.totalSalesInDb = null;

        $scope.currentPage = 1;

        $scope.pageSize = 5;

        $scope.sales = [];

        $scope.pages = function () {
            var pagesCount = Math.ceil($scope.totalSalesInDb / $scope.pageSize);
            var pages = [];
            for (var i = 0; i < pagesCount; i++) {
                pages.push(i);
            };
            return pages;
        };

        $scope.goToPage = function (pageNumber) {
            if ($scope.totalSalesInDb != null && $scope.sales.length >= $scope.totalSalesInDb) {
                alert('Данных больше нет');
                return;
            }

            var url = 'sales/Get?pageNumber=' + pageNumber + '&pageSize=' + $scope.pageSize;
            if ($scope.selectedClient) {
                url = 'sales/GetClientSales?pageNumber=' + pageNumber + '&pageSize=' + $scope.pageSize + '&clientId=' + $scope.selectedClient.id;
            }

            $http({
                method: 'get',
                url: url
            }).
                then(function (response) {
                    if (response.data) {
                        $scope.sales = response.data.items;
                        $scope.totalSalesInDb = response.data.totalRecordCount;
                        $scope.currentPage = response.data.pageNumber;
                    }
                });
        };

        $scope.saleSelected = function (sale) {
            $scope.selectedSale = sale;
        }

        $scope.goToPage($scope.currentPage);
    });
