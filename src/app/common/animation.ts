import { trigger, style, animate, transition, keyframes} from '@angular/animations';

export let bounceOutRight = trigger('bounceOutRight',[
    transition(':leave',[
        animate('0.5s ease-in',
            keyframes([
                style({offset:'.2',opacity:1,transform:'translateX(-20px)'}),
                style({offset:'1',opacity:0,transform:'translateX(100%)'})
            ])
        )
    ]),
]);

