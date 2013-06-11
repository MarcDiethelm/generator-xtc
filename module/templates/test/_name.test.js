Tc.tests.{%= nameJS %} = function( modName, $node, testApp ) {

	 // Start a QUnit module for this Terrific module
	module(modName, {
		 // prepare something for each following tests
		setup: function () {
			 // Create a new instance of the Terrific module for each test() below.
			this.mod = testApp.registerModule($node, modName);
			this.mod.start();
		},
		 // clean up after each test()
		teardown: function () {
			testApp.unregisterModules(this.mod);
		}
	});

	test( 'dummy tests', function() {

		strictEqual( true, true, 'True is true, who knew!' );
	});
};
