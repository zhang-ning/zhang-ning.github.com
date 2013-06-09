describe('Besideriver.com',function(){
    describe("funnel should be handle the frequency on spec function execute in a short time.", function() {
      var timerCallback; 

      beforeEach(function() {
        timerCallback = jasmine.createSpy('timerCallback');

        expect(River.funnel).toBeDefined();
        River.funnel.call(timerCallback);
      });

      it("should be called immediatlly", function(){
        expect(timerCallback).toHaveBeenCalled();
      })

       it("should be called once in 100 ms ", function() {
          var now = (new Date).getTime();
          setTimeout(function() {
            River.funnel.call(timerCallback);
            expect(timerCallback.callCount).toEqual(2);
            console.log(timerCallback.callCount);
            var gap = (new Date).getTime();
            console.log(gap - now);
          }, 100);
          
        });

       it("should be called once in 500 ms ", function() {
          //River.funnel.call(timerCallback);
          //expect(11).toEqual(2);
          setTimeout(function() {
            //River.funnel.call(timerCallback);
            expect(timerCallback.callCount).toEqual(1);
          }, 501);
        });

       it("should be called twice in 1000 ms ", function() {
          //River.funnel.call(timerCallback);
          setTimeout(function() {
            //River.funnel.call(timerCallback);
            expect(timerCallback.callCount).toEqual(10);
            console.log(timerCallback.callCount);
          }, 1000);
        });

    });
})
