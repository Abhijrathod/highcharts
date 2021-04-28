import type {
    HTMLDOMElement
} from '../../Core/Renderer/DOMElementType';
import type {
    CSSObject
} from '../../Core/Renderer/CSSObject';
import type HTMLAttributes from '../../Core/Renderer/HTML/HTMLAttributes';
import U from '../../Core/Utilities.js';

const {
    addEvent,
    createElement,
    objectEach
} = U;

abstract class GUIElement {

    /* *
    *
    *  Static Properties
    *
    * */

    // Get offsets of the guiElement relative to
    // the referenceElement or the Viewport.
    public static getOffsets(
        guiElement: GUIElement,
        referenceElement?: HTMLDOMElement
    ): GUIElement.Offsets {
        const offset = { left: 0, top: 0, right: 0, bottom: 0 };

        if (guiElement.container) {
            const guiElementClientRect = guiElement.container.getBoundingClientRect();
            const dashboardClientRect = referenceElement ?
                referenceElement.getBoundingClientRect() : { left: 0, top: 0 };

            offset.left = guiElementClientRect.left - dashboardClientRect.left;
            offset.top = guiElementClientRect.top - dashboardClientRect.top;
            offset.right = guiElementClientRect.right - dashboardClientRect.left;
            offset.bottom = guiElementClientRect.bottom - dashboardClientRect.top;
        }

        return offset;
    }

    /* *
    *
    *  Properties
    *
    * */

    /**
     * HTML container of a GUIElement.
     */
    public container?: HTMLDOMElement;

    /**
     * The type of a GUIElement instance.
     */
    public type?: GUIElement.GUIElementType;

    /**
     * The function to remove bindedGUIElement
     * event on GUIElement container.
     */
    public removeBindedEventFn?: Function;

    /* *
    *
    *  Functions
    *
    * */

    /**
     * Create or set existing HTML element as a GUIElement container.
     *
     * @param {GUIElement.ContainerOptions} options
     * Options.
     */
    protected setElementContainer(
        options: GUIElement.SetElementContainerOptions
    ): void {
        const guiElement = this;

        let elem;

        // @ToDo use try catch block
        if (options.render && options.parentContainer) {

            // Purge empty id attribute.
            if (options.attribs && !options.attribs.id) {
                delete options.attribs.id;
            }

            guiElement.container = createElement(
                'div',
                options.attribs || {},
                options.style || {},
                options.parentContainer
            );
        } else if (options.element instanceof HTMLElement) { // @ToDo check if this is enough
            guiElement.container = options.element;
        } else if (typeof options.elementId === 'string') {
            elem = document.getElementById(options.elementId);

            if (elem) {
                guiElement.container = elem;
            } else {
                // Error
            }
        } else {
            // Error
        }

        // Set bindedGUIElement event on GUIElement container.
        if (guiElement.container) {
            guiElement.removeBindedEventFn = addEvent(
                guiElement.container,
                'bindedGUIElement',
                function (e: GUIElement.BindedGUIElementEvent): void {
                    e.guiElement = guiElement;
                    e.stopImmediatePropagation();
                }
            );
        }
    }

    /**
     * Destroy the element, its container, event hooks
     * and all properties.
     */
    protected destroy(): void {
        const guiElement = this;

        // Remove bindedGUIElement event.
        if (guiElement.removeBindedEventFn) {
            guiElement.removeBindedEventFn();
        }

        // Remove HTML container.
        if (guiElement.container && guiElement.container.parentNode) {
            guiElement.container.parentNode.removeChild(guiElement.container);
        }

        // Delete all properties.
        objectEach(guiElement, function (val: unknown, key: string): void {
            delete (guiElement as Record<string, any>)[key];
        });
    }

    /**
     * Return the GUIElement instance type.
     * @return {GUIElement.GUIElementType|undefined}
     */
    public getType(): GUIElement.GUIElementType|undefined {
        return this.type;
    }
}

namespace GUIElement {
    export interface SetElementContainerOptions {
        render?: boolean;
        parentContainer?: HTMLDOMElement;
        attribs?: HTMLAttributes;
        style?: CSSObject;
        element?: HTMLElement;
        elementId?: string;
    }

    export interface Offsets {
        left: number;
        top: number;
        right: number;
        bottom: number;
    }

    export interface BindedGUIElementEvent extends Event {
        guiElement: GUIElement;
    }

    export type GUIElementType = 'row'|'cell'|'layout';
}

export default GUIElement;
