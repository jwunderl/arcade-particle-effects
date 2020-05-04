
namespace extraeffects {

    class ColorBreakpoint {
        constructor(
            public color: number,
            public bp: number
        ) { }
    }

    export class ColorTrailFactory extends particles.TrailFactory {
        protected totalPossible: number;
        protected colors: ColorBreakpoint[];

        constructor(anchor: particles.ParticleAnchor) {
            super(anchor, 250, 1000);
            const im = anchor.image;

            if (!im) {
                this.colors = [new ColorBreakpoint(1, 1)];
                this.totalPossible = 1;
                return;
            }

            let counts: number[] = [];
            for (let i = 0x0; i <= 0xF; i++) {
                counts[i] = 0;
            }

            for (let x = 0; x < im.width; x++) {
                for (let y = 0; y < im.height; y++) {
                    const c = im.getPixel(x, y);
                    counts[c]++;
                }
            }

            this.colors = [];

            this.totalPossible = 0;
            for (let i = 1; i <= 0xF; i++) {
                const amountOfColor = counts[i];
                if (amountOfColor) {
                    this.totalPossible += amountOfColor;
                    this.colors.push(
                        new ColorBreakpoint(i, this.totalPossible)
                    );
                }
            }

            if (this.totalPossible === 0) {
                this.colors.push(new ColorBreakpoint(1, 1));
                this.totalPossible = 1;
            }
        }

        createParticle(anchor: particles.ParticleAnchor) {
            const p = super.createParticle(anchor);
            const c = this.colors;

            p._x = Fx.iadd(
                this.galois.randomRange(-this.xRange, this.xRange),
                Fx8(anchor.x)
            );
            p._y = Fx.iadd(
                this.galois.randomRange(-this.yRange, this.yRange),
                Fx8(anchor.y)
            );

            const selectedColor = this.galois.randomRange(0, this.totalPossible);

            for (let i = 0; i < c.length; i++) {
                const node = c[i];
                if (selectedColor <= node.bp) {
                    p.color = node.color;
                    break;
                }
            }

            return p;
        }
    }

    //% fixedInstance whenUsed block="colored trail"
    export const coloredTrail = new effects.ParticleEffect(
        60,
        200,
        (anchor, pps) => {
            const factory = new ColorTrailFactory(anchor);
            const src = new particles.ParticleSource(anchor, pps, factory);

            const length = Math.sqrt(anchor.vx**2 + anchor.vy**2);
            const ax = anchor.vx / length * 100;
            const ay = anchor.vy / length * 100;
            src.setAcceleration(ax, ay);
            return src;
        }
    )


    function createEffect(
        defaultParticlesPerSecond: number,
        defaultLifespan: number,
        factoryFactory: (anchor?: particles.ParticleAnchor) => particles.ParticleFactory
    ): effects.ParticleEffect {
        return new effects.ParticleEffect(defaultParticlesPerSecond, defaultLifespan,
            (anchor: particles.ParticleAnchor, pps: number) =>
                new particles.ParticleSource(anchor, pps, factoryFactory()));
    }

}
