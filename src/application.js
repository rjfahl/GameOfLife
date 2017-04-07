angular.module("GameOfLife", [])
    .controller('GameOfLifeController', ['$interval', 'CustomGridsFactory', GameOfLifeController])

function GameOfLifeController($interval, CustomGridsFactory) {
    var AngularVC = this;

    // Variables
    AngularVC.DefaultVertical = AngularVC.Vertical = 50;
    AngularVC.DefaultHorizontal = AngularVC.Horizontal = 80;
    AngularVC.RefreshRate = 200;
    AngularVC.CurrentGeneration = 0;
    AngularVC.IsPaused = true;
    AngularVC.SelectedCustomGridName = "Template";

    // Functions
    AngularVC.SelectedCustomGrid = SelectedCustomGrid;
    AngularVC.ClearGrid = ClearGrid;
    AngularVC.PlayGame = PlayGame;
    AngularVC.StopPlaying = StopPlaying;
    AngularVC.ToggleCell = ToggleCell;
    AngularVC.LogGrid = () => console.log("Grid:", AngularVC.Grid.toString());

    // Setup
    AngularVC.CustomGrids = CustomGridsFactory();
    AngularVC.Grid = new Grid(AngularVC.Vertical, AngularVC.Horizontal);

    return AngularVC;

    function SelectedCustomGrid(index) {
        AngularVC.CurrentGeneration = 0;
        AngularVC.Vertical = AngularVC.CustomGrids[index].Grid.length;
        AngularVC.Horizontal = AngularVC.CustomGrids[index].Grid[0].length;
        AngularVC.SelectedCustomGridName = AngularVC.CustomGrids[index].Name;
        AngularVC.Grid = AngularVC.CustomGrids[index].Grid;
    }

    function ClearGrid() {
        AngularVC.Vertical = AngularVC.DefaultVertical;
        AngularVC.Horizontal = AngularVC.DefaultHorizontal;
        AngularVC.SelectedCustomGridName = "Template";
        AngularVC.CurrentGeneration = 0;
        AngularVC.Grid = new Grid(AngularVC.Vertical, AngularVC.Horizontal);
    }

    function PlayGame() {
        AngularVC.IsPaused = false;
        stop = $interval(function () {
            if (!AngularVC.IsPaused)
                Play();
            else
                AngularVC.StopPlaying();
        }, AngularVC.RefreshRate);
    }

    function StopPlaying() {
        if (angular.isDefined(stop)) {
            $interval.cancel(stop);
            stop = undefined;
        }
    }

    function ToggleCell(ver, hor) {
        if (AngularVC.Grid[ver][hor] == 0)
            AngularVC.Grid[ver][hor] = 1;
        else
            AngularVC.Grid[ver][hor] = 0;
    }

    function Grid(vertical, horizontal) {
        var Grid;
        Grid = GenerateGrid(vertical, horizontal);
        return Grid;

        function GenerateGrid(vertical, horizontal) {
            var generation = new Array(vertical)
            for (var i = 0; i < vertical; i++)
                generation[i] = Array.apply(null, Array(horizontal)).map(Number.prototype.valueOf, 0);
            return generation;
        }
    }

    function Play() {
        CreateGeneration();
        function CreateGeneration() {
            var newGrid = new Grid(AngularVC.Grid.length, AngularVC.Grid[0].length);
            for (var y = 0; y < AngularVC.Grid.length; y++)
                for (var x = 0; x < AngularVC.Grid[y].length; x++)
                    newGrid[y][x] = determineLifeInNextGeneration(y, x);
            AngularVC.CurrentGeneration++;
            AngularVC.Grid = newGrid;
        }

        function determineLifeInNextGeneration(y, x) {
            var total = findLivingHorizontalNeighbors(y, x) + findLivingVerticalNeighbors(y, x) + findLivingDiagonalNeighbors(y, x);
            if (total == 3)
                return 1;
            else if (AngularVC.Grid[y][x] == 1)
                return total < 2 || total > 3 ? 0 : 1;
            return 0;
        }

        function findLivingHorizontalNeighbors(y, x) {
            var left, right = 0;
            try {
                left = AngularVC.Grid[y][x - 1] == undefined ? 0 : AngularVC.Grid[y][x - 1];
                right = AngularVC.Grid[y][x + 1] == undefined ? 0 : AngularVC.Grid[y][x + 1];
            } catch (ex) { }
            return left + right;
        }

        function findLivingVerticalNeighbors(y, x) {
            var top, bottom = 0;
            try {
                top = AngularVC.Grid[y - 1][x] == undefined ? 0 : AngularVC.Grid[y - 1][x];
                bottom = AngularVC.Grid[y + 1][x] == undefined ? 0 : AngularVC.Grid[y + 1][x];
            } catch (ex) { }
            return top + bottom;
        }

        function findLivingDiagonalNeighbors(y, x) {
            var topLeft, topRight, bottomLeft, bottomRight = 0;
            try {
                topLeft = AngularVC.Grid[y - 1][x - 1] == undefined ? 0 : AngularVC.Grid[y - 1][x - 1];
                topRight = AngularVC.Grid[y - 1][x + 1] == undefined ? 0 : AngularVC.Grid[y - 1][x + 1];
                bottomLeft = AngularVC.Grid[y + 1][x - 1] == undefined ? 0 : AngularVC.Grid[y + 1][x - 1];
                bottomRight = AngularVC.Grid[y + 1][x + 1] == undefined ? 0 : AngularVC.Grid[y + 1][x + 1];
            } catch (ex) { }
            return topLeft + topRight + bottomLeft + bottomRight;
        }
    }
}