function GameOfLife() {
    var seed;

    function Play(initSeed, genCount) {
        seed = initSeed;
        return CreateGenerations(genCount);
    }

    function CreateGenerations(genCount) {
        for (var i = 0; i < genCount; i++) 
            seed = CreateGeneration(initializeGeneration());
        return generation;
    }

    function CreateGeneration(newGeneration) {
        for (var y = 0; y < seed.length; y++)
            for (var x = 0; x < seed[y].length; x++)
                newGeneration[y][x] = determineLifeInNextGeneration(y, x);
        return newGeneration;
    }
    
    function initializeGeneration() {
        var generation = new Array(seed.length)
        for (var i = 0; i < seed.length; i++) 
            generation[i] = new Array(seed[0].length);        
        return generation;
    }

    function determineLifeInNextGeneration(y, x) {
        var total = findLivingHorizontalNeighbors(y, x) + findLivingVerticalNeighbors(y, x) + findLivingDiagonalNeighbors(y, x);
        if (total == 3)
            return 1;
        else if (seed[y][x] == 1)
            return total < 2 || total > 3 ? 0 : 1;
        else
            return 0;
    }

    function findLivingHorizontalNeighbors(y, x) {
        var left, right = 0;
        try {
            left = seed[y][x - 1] == undefined ? 0 : seed[y][x - 1];
            right = seed[y][x + 1] == undefined ? 0 : seed[y][x + 1];
        } catch (ex) { }
        return left + right;
    }

    function findLivingVerticalNeighbors(y, x) {
        var top, bottom = 0;
        try {
            top = seed[y - 1][x] == undefined ? 0 : seed[y - 1][x];
            bottom = seed[y + 1][x] == undefined ? 0 : seed[y + 1][x];
        } catch (ex) { }
        return top + bottom;
    }

    function findLivingDiagonalNeighbors(y, x) {
        var topLeft, topRight, bottomLeft, bottomRight = 0;
        try {
            topLeft = seed[y - 1][x - 1] == undefined ? 0 : seed[y - 1][x - 1];
            topRight = seed[y - 1][x + 1] == undefined ? 0 : seed[y - 1][x + 1];
            bottomLeft = seed[y + 1][x - 1] == undefined ? 0 : seed[y + 1][x - 1];
            bottomRight = seed[y + 1][x + 1] == undefined ? 0 : seed[y + 1][x + 1];
        } catch (ex) { }
        return topLeft + topRight + bottomLeft + bottomRight;
    }

    function displayGeneration(generation) {
        for (var y = 0; y < generation.length; y++)
            console.log(generation[y].toString());
        console.log("\n");
    }

    return {
        Play: Play
    }
}