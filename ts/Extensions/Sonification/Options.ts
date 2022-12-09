/* *
 *
 *  (c) 2009-2022 Øystein Moseng
 *
 *  Default options for sonification.
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type OptionsType from '../../Core/Options';
import type Point from '../../Core/Series/Point';
import type Series from '../../Core/Series/Series';
import type SonificationTimeline from './SonificationTimeline';
import type SynthPatch from './SynthPatch';

declare global {
    namespace Sonification {
        interface EventContext {
            time: number;
            point?: Point;
            value?: number;
        }
        type SeriesCallback = (
            series: Series, timeline: SonificationTimeline
        ) => void;
        type TrackValueCallback = (context: EventContext) => number;
        type TrackStringCallback = (context: EventContext) => string;
        type TrackPredicateCallback = (context: EventContext) => boolean;
        type TrackOptions = Array<InstrumentTrackOptions|SpeechTrackOptions>;
        type InstrumentContextTrackOptions = InstrumentTrackOptions &
        ContextOptions;
        type SpeechContextTrackOptions = SpeechTrackOptions & ContextOptions;
        type ContextTrackOptions = Array<InstrumentContextTrackOptions|SpeechContextTrackOptions>;
        type MapFunctionTypes = 'linear'|'logarithmic';
        type PointGroupingAlgorithmTypes = 'minmax'|'first'|'last'|
        'middle'|'firstlast';
        type MappingParameter =
        string|number|TrackValueCallback|MappingParameterOptions;

        interface MappingParameterOptions {
            min?: number;
            max?: number;
            mapTo: string;
            mapFunction?: MapFunctionTypes;
            value?: number;
        }

        interface PitchMappingParameterOptions {
            min?: number|string;
            max?: number|string;
            mapTo: string;
            mapFunction?: MapFunctionTypes;
            value?: number;
        }

        interface FilterMappingOptions {
            frequency?: MappingParameter;
            resonance?: MappingParameter;
        }

        interface TremoloMappingOptions {
            depth?: MappingParameter;
            speed?: MappingParameter;
        }

        interface PointGroupingOptions {
            enabled?: boolean;
            groupTimespan?: number;
            algorithm?: PointGroupingAlgorithmTypes;
            prop?: string;
        }

        interface BaseTrackOptions {
            pointGrouping?: PointGroupingOptions;
            activeWhen?: TrackPredicateCallback|ValueConstraints;
        }

        interface InstrumentTrackMappingOptions {
            time?: MappingParameter;
            pan?: MappingParameter;
            volume?: MappingParameter;
            pitch?: (
                string[]|number[]|string|number|PitchMappingParameterOptions
            );
            frequency?: MappingParameter;
            gapBetweenNotes?: MappingParameter;
            playDelay?: MappingParameter;
            noteDuration?: MappingParameter;
            tremolo?: TremoloMappingOptions;
            lowpass?: FilterMappingOptions;
            highpass?: FilterMappingOptions;
        }

        interface InstrumentTrackOptions extends BaseTrackOptions {
            type?: 'instrument';
            instrument: string|SynthPatch.SynthPatchOptions;
            mapping?: InstrumentTrackMappingOptions;
            roundToMusicalNotes?: boolean;
        }

        interface ValueConstraints {
            min?: number;
            max?: number;
            crossingUp?: number;
            crossingDown?: number;
            prop?: string;
        }

        interface ContextOptions {
            timeInterval?: number;
            valueInterval?: number;
            valueProp?: string;
            valueMapFunction?: MapFunctionTypes;
            activeWhen?: TrackPredicateCallback|ValueConstraints;
        }

        interface SpeechTrackMappingOptions {
            time?: MappingParameter;
            text: string|TrackStringCallback;
            playDelay?: MappingParameter;
            rate?: MappingParameter;
            pitch?: MappingParameter;
        }

        interface SpeechTrackOptions extends BaseTrackOptions {
            type: 'speech';
            mapping?: SpeechTrackMappingOptions;
            preferredVoice?: string;
            language: string;
        }

        interface ChartSonificationEventsOptions {
            onPlay?: Function;
            onEnd?: Function;
            onSeriesStart?: SeriesCallback;
            onSeriesEnd?: SeriesCallback;
            onBoundaryHit?: Function;
        }

        interface ChartSonificationOptions {
            enabled: boolean;
            duration: number;
            afterSeriesWait: number;
            masterVolume: number;
            order: 'sequential'|'simultaneous';
            events?: ChartSonificationEventsOptions;
            showPlayMarker: boolean;
            showCrosshairOnly?: boolean;
            pointGrouping: PointGroupingOptions;
            globalTracks?: TrackOptions;
            globalContextTracks?: ContextTrackOptions;
            /**
             * Used to create a track for series without options
             */
            defaultInstrumentOptions: InstrumentTrackOptions;
            defaultSpeechOptions: SpeechTrackOptions;
        }

        interface SonificationGroupingOptions {
            enabled?: boolean;
            algorithm?: 'minmax'|'average'|'sum';
            maxPointsPerSecond?: number;
        }

        interface SeriesSonificationOptions {
            enabled?: boolean;
            pointGrouping?: SonificationGroupingOptions;
            /**
             * Map data points to sounds
             */
            tracks?: TrackOptions;
            /**
             * Continuously play context sounds
             */
            contextTracks?: ContextTrackOptions;
        }
    }
}

declare module '../../Core/Options'{
    interface Options {
        sonification?: Sonification.ChartSonificationOptions;
    }
    interface LangOptions {
        downloadMIDI?: string;
        playAsSound?: string;
    }
}

declare module '../../Core/Series/SeriesOptions' {
    interface SeriesOptions {
        sonification?: Sonification.SeriesSonificationOptions;
    }
}


const Options: DeepPartial<OptionsType> = {
    sonification: {
        enabled: true,
        duration: 6000,
        afterSeriesWait: 700,
        masterVolume: 0.6,
        order: 'sequential',
        showPlayMarker: true,
        defaultInstrumentOptions: {
            instrument: 'piano',
            mapping: {
                time: 'x',
                pan: 'x',
                noteDuration: 200,
                pitch: {
                    mapTo: 'y',
                    min: 'c2',
                    max: 'c6'
                }
            },
            pointGrouping: {
                enabled: true,
                groupTimespan: 15,
                algorithm: 'minmax',
                prop: 'y'
            }
        },
        defaultSpeechOptions: {
            language: 'en-US',
            mapping: {
                time: 'x',
                rate: 1.3
            },
            pointGrouping: {
                enabled: true,
                groupTimespan: 10,
                algorithm: 'last',
                prop: 'y'
            }
        }
    },
    exporting: {
        menuItemDefinitions: {
            downloadMIDI: {
                textKey: 'downloadMIDI',
                onclick: function (): void {
                    if (this.sonification) {
                        this.sonification.downloadMIDI();
                    }
                }
            },
            playAsSound: {
                textKey: 'playAsSound',
                onclick: function (): void {
                    const s = this.sonification;
                    if (s && s.isPlaying()) {
                        s.cancel();
                    } else {
                        this.sonify();
                    }
                }
            }
        }
    },
    lang: {
        downloadMIDI: 'Download MIDI',
        playAsSound: 'Play as sound'
    }
};

export default Options;
