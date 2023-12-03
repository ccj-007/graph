async function main() {
    // 获取适配器
    const adapter = await navigator.gpu?.requestAdapter();
    const device = await adapter?.requestDevice();
    if (!device) {
        alert('need a browser that supports WebGPU');
        return;
    }

    const canvas = document.querySelector('canvas');
    // 获取设备的 DPR
    const dpr = window.devicePixelRatio || 1;

    // 根据设备的 DPR 设置画布的实际分辨率
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;

    const context = canvas.getContext('webgpu');
    const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
    context.configure({
        device,
        format: presentationFormat,
    });

    const module = device.createShaderModule({
        label: 'our hardcoded red triangle shaders',
        code: `
      struct outVS {
        @builtin(position) position: vec4f,
        @location(0) color: vec4f,
      };

      @vertex fn vs(
        @builtin(vertex_index) vertexIndex : u32
      ) -> outVS {
        let pos = array(
          vec2f( 0.0,  0.5),  // top center
          vec2f(-0.5, -0.5),  // bottom left
          vec2f( 0.5, -0.5)   // bottom right
        );
         var color = array<vec4f, 3>(
          vec4f(1, 0, 0, 1), // red
          vec4f(0, 1, 0, 1), // green
          vec4f(0, 0, 1, 1), // blue
        );

        var vsOutput: outVS;
        vsOutput.position = vec4f(pos[vertexIndex], 0.0, 1.0);
        vsOutput.color = color[vertexIndex];
        return vsOutput;
      }

      @fragment fn fs(@location(0) color: vec4f) -> @location(0) vec4f {
        return color;
      }
    `,
    });

    const pipeline = device.createRenderPipeline({
        label: 'our hardcoded red triangle pipeline',
        layout: 'auto',
        vertex: {
            module,
            entryPoint: 'vs',
        },
        fragment: {
            module,
            entryPoint: 'fs',
            targets: [{ format: presentationFormat }],
        },
    });

    const renderPassDescriptor = {
        label: 'our basic canvas renderPass',
        colorAttachments: [
            {
                clearValue: [0, 0, 0, 1],
                loadOp: 'clear',
                storeOp: 'store',
            },
        ],
    };

    function render() {
        renderPassDescriptor.colorAttachments[0].view =
            context.getCurrentTexture().createView();

        const encoder = device.createCommandEncoder({ label: 'our encoder' });

        const pass = encoder.beginRenderPass(renderPassDescriptor);

        pass.setPipeline(pipeline);
        pass.draw(3);
        pass.end();

        const commandBuffer = encoder.finish();
        device.queue.submit([commandBuffer]);
    }

    render();
}

main();
